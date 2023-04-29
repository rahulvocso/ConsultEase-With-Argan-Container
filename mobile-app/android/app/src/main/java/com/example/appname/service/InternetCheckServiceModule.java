package com.example.appname.service;

import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.example.appname.service.InternetCheckService;

public class InternetCheckServiceModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public InternetCheckServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "InternetCheckService";
    }

    @ReactMethod
    public void startService() {
        Context context = getReactApplicationContext();
        Intent intent = new Intent(context, InternetCheckService.class);
        context.startService(intent);
    }

    @ReactMethod
    public void stopService() {
        Context context = getReactApplicationContext();
        Intent intent = new Intent(context, InternetCheckService.class);
        context.stopService(intent);
    }
}
