package com.example.appname;

import android.content.Context;
import android.os.Bundle;
import androidx.annotation.Nullable;
import com.facebook.react.ReactActivity;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.facebook.react.ReactInstanceManager;

import com.facebook.react.bridge.ReactContext;
import com.example.appname.MainApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactApplicationContext;

// import com.voximplant.foregroundservice.VIForegroundServicePackage;
import android.content.Intent;

//import com.example.appname.service.InternetCheckServiceModule;

public class MainActivity extends ReactActivity {
  private ReactInstanceManager mReactInstanceManager;
  // private InternetCheckServiceModule internetCheckServiceModule;
  private ReactApplicationContext reactContext;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);

    // for internet service check @supersami/react-native-foreground-service
    // Intent intent = new Intent(this,
    // VIForegroundServicePackage.getForegroundServiceClass());
    // startService(intent);

    // native service added by rahul
    // internetCheckServiceModule = new InternetCheckServiceModule(reactContext);
    // internetCheckServiceModule.startService();
    // internetCheckServiceModule.stopService();

  }

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   *
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "AppName";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util
   * class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and
   * Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e.
        // React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
    );
  }
}
