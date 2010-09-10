// Script that puts a window on-screen where the player can toggle who he controls
// It works by sending SetControllable messages to turn the different characters on and off.
// It also changes who the CameraScrolling scripts looks at.

// An internal reference to the attached CameraScrolling script
private var cameraScrolling : CameraScrolling;

// Who is the player controlling
private var selected = 0;

// List of objects to control
var targets : Transform[];

// What to display on the buttons in the window
var targetButtonNames : String[];


// On start up, we send the SetControllable () message to turn the different players on and off.
function Awake () {

	// Get the reference to our CameraScrolling script attached to this camera;
	cameraScrolling = GetComponent (CameraScrolling);
	
	// Set the scrolling camera's target to be our character at the start.
	cameraScrolling.SetTarget (targets[0], true);
	
	// tell all targets (except the first one) to switch off.
	for (var i=0; i < targets.Length; i++) 
		targets[i].gameObject.SendMessage ("SetControllable", (i == 0), SendMessageOptions.DontRequireReceiver);
}

private var windowRect = Rect (20, 20, 250, 50);
// Make the onscreen GUI to let the player switch control between Lerpz and the spaceship.
function OnGUI () {
	// Make a popup window
	windowRect = GUILayout.Window (0, windowRect, DoControlsWindow, "Controls");
	
	// The window can be dragged around by the users - make sure that it doesn't go offscreen.
	windowRect.x = Mathf.Clamp (windowRect.x, 0.0, Screen.width - windowRect.width);
	windowRect.y = Mathf.Clamp (windowRect.y, 0.0, Screen.height - windowRect.height);
}

// Make the contents of the window
function DoControlsWindow (windowID : int) {

}

// Ensure there is a CameraScrolling script attached to the same GameObject, as this script
// relies on it.
@script RequireComponent (CameraScrolling)
