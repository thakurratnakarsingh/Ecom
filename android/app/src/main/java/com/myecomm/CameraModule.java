package com.myecomm; // <-- Use your actual package name

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CameraModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final int REQUEST_IMAGE_CAPTURE = 1;
    private Promise cameraPromise;
    private Uri photoUri;

    public CameraModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "CameraModule";
    }

    @ReactMethod
    public void launchCamera(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No activity found");
            return;
        }
        cameraPromise = promise;
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(activity.getPackageManager()) != null) {
            File photoFile = null;
            try {
                photoFile = createImageFile(activity);
            } catch (IOException ex) {
                promise.reject("FILE_CREATION_FAILED", ex.getMessage());
                return;
            }
            if (photoFile != null) {
                photoUri = FileProvider.getUriForFile(activity,
                        activity.getPackageName() + ".provider",
                        photoFile);
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);
                activity.startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
            }
        } else {
            promise.reject("NO_CAMERA", "No camera app found");
        }
    }

    private File createImageFile(Activity activity) throws IOException {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = activity.getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        return File.createTempFile(imageFileName, ".jpg", storageDir);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == REQUEST_IMAGE_CAPTURE && cameraPromise != null) {
            if (resultCode == Activity.RESULT_OK) {
                cameraPromise.resolve(photoUri.toString());
            } else {
                cameraPromise.reject("CANCELLED", "Camera cancelled");
            }
            cameraPromise = null;
        }
    }

    @Override
    public void onNewIntent(Intent intent) {}
}