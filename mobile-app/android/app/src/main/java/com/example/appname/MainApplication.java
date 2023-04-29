package com.example.appname;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import com.facebook.react.shell.MainReactPackage;
import java.util.List;

import com.facebook.react.bridge.ReactApplicationContext;
// import com.example.appname.service.InternetCheckServiceModule;
// import com.voximplant.foregroundservice.VIForegroundServicePackage;

public class MainApplication extends Application implements ReactApplication {
  public ReactApplicationContext reactContext;

  private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be auto linked yet can be added manually here, for
      // example:
      // packages.add(new MyReactNativePackage());

      // packages.add(new VIForegroundServicePackage());

      // native service module added by rahul
      // packages.add(new InternetCheckServiceModule());
      // packages.add(new InternetCheckServiceModule(this.reactNativeHost.
      // getReactInstanceManager().getCurrentReactContext()));
      // return Arrays.<ReactPackage>asList(
      // new MainReactPackage(),
      // new InternetCheckServiceModule()
      // );

      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected boolean isNewArchEnabled() {
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }

    @Override
    protected Boolean isHermesEnabled() {
      return BuildConfig.IS_HERMES_ENABLED;
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for
      // this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
