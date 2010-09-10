// The object in our scene that our camera is currently tracking.
private var target : Transform;
// How far back should the camera be from the target?
var Distance = 150.0;
var boundXMax=50;
var boundXMin=0;
var boundZMax=50;
var boundZMin=0;

// Keep handy reference sto our level's attributes.  We set up these references in the Awake () function.
// This also is very slightly more performant, but it's mostly just convenient.

private var targetLock = false;

// This is for setting interpolation on our target, but making sure we don't permanently
// alter the target's interpolation setting.  This is used in the SetTarget () function.
private var savedInterpolationSetting = RigidbodyInterpolation.None;

function Awake () {
	// Set up our convenience references.
}

function SetTarget (newTarget : Transform, snap : boolean) {
	// If there was a target, reset its interpolation value if it had a rigidbody.
	if  (target) {
		// Reset the old target's interpolation back to the saved value.
		targetRigidbody = target.GetComponent (Rigidbody);
		if  (targetRigidbody)
			targetRigidbody.interpolation = savedInterpolationSetting;
	}
	
	// Set our current target to be the value passed to SetTarget ()
	target = newTarget;
	
	// Now, save the new target's interpolation setting and set it to interpolate for now.
	// This will make our camera move more smoothly.  Only do this if we didn't set the
	// target to null (nothing).
	if (target) {
		targetRigidbody = target.GetComponent (Rigidbody);
		if (targetRigidbody) {
			savedInterpolationSetting = targetRigidbody.interpolation;
			targetRigidbody.interpolation = RigidbodyInterpolation.Interpolate;
		}
	}
	
	// If we should snap the camera to the target, do so now.
	// Otherwise, the camera's position will change in the LateUpdate () function.
	if  (snap) {
		transform.position = GetGoalPosition ();
	}
}

// Provide another version of SetTarget that doesn't require the snap variable to set.
// This is for convenience and cleanliness.  By default, we will not snap to the target.
function SetTarget (newTarget : Transform) {
	SetTarget (newTarget, false);
}

// This is a simple accessor function, sometimes called a "getter".  It is a publically callable
// function that returns a private variable.  Notice how target defined at the top of the script
// is marked "private"?  We can not access it from other scripts directly.  Therefore, we just
// have a function that returns it.  Sneaky!
function GetTarget () {
	return target;
}

// You almost always want camera motion to go inside of LateUpdate (), so that the camera follows
// the target _after_ it has moved.  Otherwise, the camera may lag one frame behind.
function LateUpdate () {
	// Where should our camera be looking right now?
	var goalPosition = GetGoalPosition ();
	
	// Interpolate between the current camera position and the goal position.
	// See the documentation on Vector3.Lerp () for more information.
	transform.position = goalPosition;	
}

// Based on the camera attributes and the target's special camera attributes, find out where the
// camera should move to.
function GetGoalPosition () {
	// If there is no target, don't move the camera.  So return the camera's current position as the goal position.
	if  (!target)
		return transform.position;
var clampOffset = Vector3.zero;
	var heightOffset = 0.0;
	// Look for CameraTargetAttributes in our target.
	var cameraTargetAttributes = target.GetComponent (CameraTargetAttributes);
	
	// If our target has special attributes, use these instead of our above defaults.
	if  (cameraTargetAttributes) {
		heightOffset = cameraTargetAttributes.heightOffset;
	}
	
	// First do a rough goalPosition that simply follows the target at a certain relative height and distance.
	var x=target.position.x;
	var y=Distance;
	var z=target.position.z;
	if(x<boundXMin)
	{
		x=boundXMin;
	}else
	if(x>boundXMax)
	{
		x=boundXMax;
	}
	if(z<boundZMin)
	{
		z=boundZMin;
	}else
	if(z>boundZMax)
	{
		z=boundZMax;
	}
	var goalPosition = Vector3 (x, y,z );

	return goalPosition;
}
