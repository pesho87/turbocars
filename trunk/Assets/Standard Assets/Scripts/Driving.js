var wheelColliderFrontLeft:WheelCollider;
var wheelColliderFrontRight:WheelCollider;
var wheelColliderBackLeft:WheelCollider;
var wheelColliderBackRight:WheelCollider;
var maxTorque=150.0;
var maxBreakTorque=500.0;
var maxSteerAngle=30.0;
var steerStep:float=1.0;
var guiSpeed:GUIText;
var wheelFrontLeft:Transform;
var wheelFrontRight:Transform;
var wheelBackLeft:Transform;
var wheelBackRight:Transform;

var guiSpeedPointer:Texture2D;
var guiSpeedDisplay:Texture2D;
var gearSpeed:int[];
var maxSpeed:float=200.0;
var currentSpeed:float=0.0;

private var currentGear:int;

function Start() 
{
	rigidbody.centerOfMass.y = 0;
}
function OnGUI()
{
	GUI.Box(Rect(0.0,0.0,140.0,140.0),guiSpeedDisplay);
	GUIUtility.RotateAroundPivot(currentSpeed+40,Vector2(70,70));
	GUI.DrawTexture(Rect(0.0,0.0,140.0,140.0),guiSpeedPointer,ScaleMode.StretchToFill,true,0);
}
function Update()
{

RotateWheels();
SteelWheels();
}
function RotateWheels()
{
wheelFrontLeft.Rotate(wheelColliderFrontLeft.rpm/60*360*Time.deltaTime,0,0);
wheelFrontRight.Rotate(wheelColliderFrontRight.rpm/60*360*Time.deltaTime,0,0);
wheelBackLeft.Rotate(wheelColliderBackLeft.rpm/60*360*Time.deltaTime,0,0);
wheelBackRight.Rotate(wheelColliderBackRight.rpm/60*360*Time.deltaTime,0,0);
}
function SteelWheels()
{
wheelFrontLeft.localEulerAngles.y=wheelColliderFrontRight.steerAngle-wheelFrontLeft.localEulerAngles.z;
wheelFrontRight.localEulerAngles.y=wheelColliderFrontRight.steerAngle-wheelFrontLeft.localEulerAngles.z;
}
function setCurrentGear()
{
	 var gearNumber:int;
	 gearNumber=gearSpeed.length;
	 for(var i=0;i<gearNumber;i++)
	 {
		 if(gearSpeed[i]>currentSpeed)
		 {
			currentGear=i;
			break;
		 }
	 }
}
function GearSound()
{ 
	var tempMinSpeed:float=0.00;
	var tempMaxSpeed:float=0.00;
	var currentPitch:float=0.00;
	switch(currentGear)
	{
		case 0:
			tempMinSpeed=0.00;
			tempMaxSpeed=gearSpeed[currentGear];
			break;
		default:
			tempMinSpeed=gearSpeed[currentGear-1];
			tempMaxSpeed=gearSpeed[currentGear];
			break;
	}
	currentPitch=(((currentSpeed-tempMin)/(tempMaxSpeed-tempMinSpeed))+1);
	audio.pitch = currentSpeed/maxSpeed+1;
}
function FixedUpdate()
{
	currentSpeed=(Mathf.PI*2*wheelColliderFrontLeft.radius)*wheelColliderFrontLeft.rpm*60/1000;
	currentSpeed=Mathf.Round(currentSpeed);
	isBreaking=(currentSpeed>0&&Input.GetAxis("Vertical")<0);

	guiSpeed.text=isBreaking.ToString();
	guiSpeed.material.color=Color.green;




	if(currentSpeed<maxSpeed&&Input.GetAxis("Vertical")>0)
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