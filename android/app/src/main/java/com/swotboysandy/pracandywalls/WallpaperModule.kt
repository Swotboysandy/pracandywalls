package com.swotboysandy.pracandywalls

import android.app.WallpaperManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.net.URL
import java.util.concurrent.Executors

class WallpaperModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "WallpaperModule"

    @ReactMethod
    fun setWallpaper(url: String, screen: String, promise: Promise) {
        val executor = Executors.newSingleThreadExecutor()
        executor.execute {
            try {
                val wallpaperManager = WallpaperManager.getInstance(reactApplicationContext)
                val inputStream = URL(url).openStream()
                val bitmap = BitmapFactory.decodeStream(inputStream)
                
                var flag = WallpaperManager.FLAG_SYSTEM
                if (screen == "lock") flag = WallpaperManager.FLAG_LOCK
                if (screen == "both") flag = WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK

                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                     wallpaperManager.setBitmap(bitmap, null, true, flag)
                } else {
                     wallpaperManager.setBitmap(bitmap)
                }
                
                promise.resolve("Success")
            } catch (e: Exception) {
                promise.reject("ERROR", e.message)
            }
        }
    }
}
