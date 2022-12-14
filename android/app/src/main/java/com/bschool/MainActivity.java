package com.bschool;
import com.facebook.react.ReactActivity;
import android.content.Intent;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;

import io.branch.rnbranch.*; // <-- add this
import android.content.Intent; // <-- and this
public class MainActivity extends ReactActivity {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    RNBranchModule.onNewIntent(intent);

}

  @Override
  protected String getMainComponentName() {
    return "bschool";
  }
 // Override onStart, onNewIntent:
 @Override
 protected void onStart() {
     super.onStart();
     RNBranchModule.initSession(getIntent().getData(), this);
 }


   @Override
    protected void onCreate(Bundle savedInstanceState) {
        // SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);

    }
}
