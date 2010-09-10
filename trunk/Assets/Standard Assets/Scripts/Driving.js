var wheelColliderFrontLeft:WheelCollider;
var wheelColliderFrontRight:WheelCollider;
var wheelColliderBackLeft:WheelCollider;
var wheelColliderBackRight:WheelCollider;
var maxTorque=150.0;
var maxBreakTorque=500.0;
var maxSteerAngle=30.0;
var steerStep:float=1.0;
var guiSpees:GUIText;
var wheelFrontLeft:Transform;
var wheelFrontRight:Transform;
var wheelBackLeft:Transform;
var wheelBackRight:Transform;

var guiSpeedPointer:Texture2D;
var guiSpeedDisplay:Texture2D;

var maxSpeed:float=200.0;
var currentSpeed:float=0.0;

function Start() 
{
	rigidbody.centerOfMass.y = 0;
}

function FixedUpdate()
{
	currentSpeed=(Mathf.PI*2*wheelColliderFrontLeft.radius)*wheelColliderFrontLeft.rpm*60/1000;
	currentSpeed=Mathf.Round(currentSpeed);
	isBreaking=(currentSpeed>0&&Input.GetAxis("Vertical")<0);

	if(currentSpeed<maxSpeed)
	{
		wheelColliderFrontLeft.motorTorque=maxTorque*Input.GetAxis("Vertical");
		wheelColliderFrontRight.motorTorque=maxTorque*Input.GetAxis("Vertical");
	}else
	{
		wheelColliderFrontLeft.motorTorque=0;
		wheelColliderFrontRight.motorTorque=0;
	}
	if(isBreaking)
	{
		wheelColliderFrontLeft.brakeTorque=maxBreakTorque;
		wheelColliderFrontRight.brakeTorque=maxBreakTorque;
	}else
	{
		wheelColliderFrontLeft.brakeTorque=0;
		wheelColliderFrontRight.brakeTorque=0;
	}
		
	wheelColliderFrontLeft.steerAngle=maxSteerAngle*Input.GetAxis("Horizontal");
	wheelColliderFrontRight.steerAngle=maxSteerAngle*Input.GetAxis("Horizontal");
	

}