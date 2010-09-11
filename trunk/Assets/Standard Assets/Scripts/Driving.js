var wheelColliderFrontLeft:WheelCollider;
var wheelColliderFrontRight:WheelCollider;
var wheelColliderBackLeft:WheelCollider;
var wheelColliderBackRight:WheelCollider;
var maxTorque=150.0;
var maxBreakTorque=500.0;
var fullBreakTorque=5000.0;
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
var maxBackwardSpeed:float=40.0;
var currentSpeed:float=0.0;

var x:int;
var y:int;
var z:int;
private var currentGear:int;
private var oldForwardFriction:float;
private var oldSidewaysFriction:float;

var slideForwardFriction:float;
var slideSidewaysFriction:float;

function Start() 
{
	rigidbody.centerOfMass = Vector3 (x, y, z);
    oldForwardFriction=wheelColliderFrontRight.forwardFriction.stiffness;
    oldSidewaysFriction=wheelColliderFrontRight.sidewaysFriction.stiffness;

}
function SetFriction(ForwardFriction:float,SidewaysFriction:float)
{
	wheelColliderFrontLeft.forwardFriction.stiffness=ForwardFriction;
	wheelColliderFrontRight.forwardFriction.stiffness=ForwardFriction;
	wheelColliderBackLeft.forwardFriction.stiffness=ForwardFriction;
	wheelColliderBackRight.forwardFriction.stiffness=ForwardFriction;
	
	wheelColliderFrontLeft.sidewaysFriction.stiffness=SidewaysFriction;
	wheelColliderFrontRight.sidewaysFriction.stiffness=SidewaysFriction;
	wheelColliderBackLeft.sidewaysFriction.stiffness=SidewaysFriction;
	wheelColliderBackRight.sidewaysFriction.stiffness=SidewaysFriction;
}
function OnGUI()
{
	var pointerPosition:float=40.0;
	GUI.Box(Rect(0.0,0.0,140.0,140.0),guiSpeedDisplay);
	if(currentSpeed>0)
	{
		pointerPosition=currentSpeed + 40;
	}
	GUIUtility.RotateAroundPivot(pointerPosition,Vector2(70,70));
	GUI.DrawTexture(Rect(0.0,0.0,140.0,140.0),guiSpeedPointer,ScaleMode.StretchToFill,true,0);
}
function Update()
{
	setCurrentGear();
	RotateWheels();
	SteelWheels();
}
function FullBraking()
{
	if(Input.GetKey("space"))
	{
		wheelColliderBackLeft.brakeTorque=fullBreakTorque;
		wheelColliderBackRight.brakeTorque=fullBreakTorque;
		
		if((Mathf.Abs(rigidbody.velocity.z)>1)||(Mathf.Abs(rigidbody.velocity.x)>1))
		{
			SetFriction(slideForwardFriction,slideSidewaysFriction);
		}else
		{
			SetFriction(oldForwardFriction,oldSidewaysFriction);
		}
	}else
	{
		SetFriction(oldForwardFriction,oldSidewaysFriction);
		wheelColliderBackLeft.brakeTorque=0;
		wheelColliderBackRight.brakeTorque=0;
	}
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
	 GearSound();
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
	currentPitch=(((Mathf.Abs(currentSpeed)- tempMinSpeed)/(tempMaxSpeed-tempMinSpeed))+0.8);
	audio.pitch = currentSpeed/maxSpeed+1;
}
function FixedUpdate()
{
FullBraking();
	currentSpeed=(Mathf.PI*2*wheelColliderFrontLeft.radius)*wheelColliderFrontLeft.rpm*60/1000;
	currentSpeed=Mathf.Round(currentSpeed);
	isBreaking=((currentSpeed>0&&Input.GetAxis("Vertical")<0) || (currentSpeed<0&&Input.GetAxis("Vertical")>0));

	
	guiSpeed.material.color=Color.green;



	if(!isBreaking)
	{
		wheelColliderFrontLeft.brakeTorque=0;
		wheelColliderFrontRight.brakeTorque=0;
		guiSpeed.text=currentSpeed.ToString() +(maxBackwardSpeed*-1).ToString();
		if((currentSpeed<maxSpeed)&&(currentSpeed>(maxBackwardSpeed*-1)))
		{
			wheelColliderFrontLeft.motorTorque=maxTorque*Input.GetAxis("Vertical");
			wheelColliderFrontRight.motorTorque=maxTorque*Input.GetAxis("Vertical");
		}else
		{
			wheelColliderFrontLeft.motorTorque=0;
		    wheelColliderFrontRight.motorTorque=0;
		}
	}
	else
	{
		wheelColliderFrontLeft.brakeTorque=maxBreakTorque;
		wheelColliderFrontRight.brakeTorque=maxBreakTorque;
		wheelColliderFrontLeft.motorTorque=0;
		wheelColliderFrontRight.motorTorque=0;
	}

	wheelColliderFrontLeft.steerAngle=maxSteerAngle*Input.GetAxis("Horizontal");
	wheelColliderFrontRight.steerAngle=maxSteerAngle*Input.GetAxis("Horizontal");
	

}