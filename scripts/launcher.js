require('colors');
const prompts = require('prompts');
const pkg = require('./package.json');
const { isFQDN, isIP, isEmail } = require('validator');
const exec = require('child_process').execSync;

const backendOutput = {
    PORT: 4000,
    PUBLIC_IP_ADDRESS: '192.168.1.1',
    MAPPED_IP: false,
};

(async () => {
    const arg = process.argv[2];

    console.log(`received command: ${arg}`.cyan);

    console.log("");
    console.log("Honeyside".yellow);
    console.log(`Argan v${pkg.version} Installer`.yellow);
    console.log("");

    if (!['setup', 'rebuild', 'start', 'stop', 'restart'].includes(arg)) {
        console.log("");
        console.log(`invalid command: ${arg}`.red);
        console.log("");
        return;
    }

    let response, domain, email, nginx;

    if (arg === 'setup') {

        console.log('Argan needs to know the public ip address of your machine.'.cyan);
        console.log('This is required for the meeting system to work, as traffic will be routed via UDP or TCP through such ip address.');
        console.log('If you don\'t know your ip address, run "ping argan.example.com" (replace with your domain) from a local terminal.');

        response = await prompts({
            type: 'text',
            name: 'value',
            message: 'Your public ip address',
            validate: (e) => isIP(e) || `Must be a valid ip address`,
        });

        backendOutput['PUBLIC_IP_ADDRESS'] = response.value;

        console.log('');
        console.log('Are you using a mapped to public ip address, instead of a public one?'.cyan);
        console.log('Should be YES for AWS, Azure, Google Cloud and other public cloud instances.');
        console.log('Should be NO for OVH, DigitalOcean, Hetzner and other VPS providers.');

        response = await prompts({
            type: 'confirm',
            name: 'value',
            message: 'Are you using a mapped ip address?',
        });

        backendOutput['MAPPED_IP'] = response.value;

        console.log('');
        console.log('Argan requires a domain, such as argan.example.com.'.cyan);
        console.log('Make sure your DNS configuration gets properly propagated before moving forward.');
        console.log('You can use https://dnschecker.org/');

        response = await prompts({
            type: 'text',
            name: 'value',
            message: 'Your domain name',
            validate: (e) => isFQDN(e) || `Must be a valid domain`,
        });

        domain = response.value;

        console.log('');
        console.log('Do you want to install nginx reverse proxy and SSL with Let\'s Encrypt?'.cyan);
        console.log('YES if you are running this on a clean server (recommended).');
        console.log('NO if you are running other apps on this machines. You will have to complete the installation manually.');

        response = await prompts({
            type: 'confirm',
            name: 'value',
            message: 'Do you want to install nginx?',
        });

        nginx = response.value;

        if (nginx) {
            console.log('');
            console.log('Your email will be used to generate a Let\'s Encrypt SSL certificate for the domain.'.cyan);
            console.log('It will also be the email related to the admin user account.');

            response = await prompts({
                type: 'text',
                name: 'value',
                message: 'Your Email',
                validate: (e) => isEmail(e) || `Must be a valid email`,
            });

            email = response.value;
        }

        console.log('');
        console.log('Configuration complete!'.green);
        console.log('Will now begin installation'.yellow);
        console.log('');

        let backendOutputString = '';

        Object.keys(backendOutput).forEach(key => {
            backendOutputString += key;
            backendOutputString += '=';
            backendOutputString += backendOutput[key];
            backendOutputString += '\n';
        });

        exec(`echo "${backendOutputString}" >> "../backend/.env"`);
    }

    if (['setup', 'rebuild'].includes(arg)) {
        response = exec('grep \'^NAME\' /etc/os-release');

        const os = response.toString();

        response = exec('lsb_release -r');

        const version = response.toString();

        if (!os.includes('Ubuntu')) {
            console.log('Current OS is not Ubuntu. Aborting.'.red);
            console.log('If you are running this on Ubuntu, please contact Honeyside Support.');
            return process.exit(0);
        }

        if (!version.includes('22.10') && !version.includes('22.04') && !version.includes('20.04') && !version.includes('18.04')) {
            console.log('This is not a supported Ubuntu version.'.red);
            console.log('The only supported versions are 22.04 LTS, 22.10, 20.04 LTS and 18.04 LTS');
            console.log('If you are running this on a correct version, please contact Honeyside Support.');
            return process.exit(0);
        }

        console.log(`${arg === 'setup' ? 'installing' : 'rebuilding'} Argan backend...`.yellow);
        console.log('installing backend node modules...');
        console.log('this might take a while, depending on your machine cpu, ram and connection speed');
        console.log('(might be even 10-15 minutes, please keep calm and wait patiently)');
        exec('cd ../backend && yarn');
        console.log('starting backend...');
        try {
            exec('pm2 delete --silent Argan', {stdio : 'pipe'});
        } catch (e) {}
        exec('cd ../backend && pm2 start --name Argan yarn -- start');
        exec('pm2 save');
        exec('pm2 startup');
        console.log('Argan backend started'.green);
    }

    if (arg === 'start') {
        try {
            exec('cd ../backend && pm2 start --name Argan yarn -- start');
        } catch (e) {}
    }

    if (arg === 'restart') {
        try {
            exec('pm2 restart Argan', {stdio : 'pipe'});
        } catch (e) {}
    }

    if (arg === 'stop') {
        try {
            exec('pm2 stop Argan', {stdio : 'pipe'});
        } catch (e) {}
    }

    if (arg === 'setup' && nginx) {
        console.log('');
        console.log('installing nginx...'.yellow);
        try {
            exec('sudo apt-get update');
        } catch (e) {}
        try {
            exec('sudo apt-get install nginx certbot python3-certbot-nginx -y');
        } catch (e) {}
        console.log('configuring nginx...');
        try {
            exec('sudo unlink /etc/nginx/sites-enabled/default');
        } catch (e) {}
        try {
            exec(`echo "server {\n    listen 80 default_server;\n    listen [::]:80 default_server;\n    server_name ${domain};\n    location / {\n        proxy_pass http://localhost:${backendOutput.PORT};\n    }\n}" >> /etc/nginx/sites-available/argan.conf`);
        } catch (e) {}
        try {
            exec('sudo ln -s /etc/nginx/sites-available/argan.conf /etc/nginx/sites-enabled/argan.conf');
        } catch (e) {}
        try {
            exec('service nginx restart');
        } catch (e) {}
        console.log('running certbot...');
        try {
            exec(`sudo certbot --nginx -d ${domain} --non-interactive --agree-tos -m ${email}`);
        } catch (e) {}
        console.log('adding ssl renewal cron job...');
        try {
            exec('(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -');
        } catch (e) {}

        console.log('nginx installation complete'.green);
    }

    if (arg === 'stop') {
        console.log("");
        console.log(`Argan has been stopped.`.green);
        console.log("");
    } else {
        console.log("");
        console.log(`Argan v${pkg.version} ${arg === 'setup' ? 'setup' : 'restart'} complete!`.green);
        if (arg === 'setup') {
            console.log(`You should now be able to access Argan at ${domain}`);
        }
        console.log("");
    }
})();
