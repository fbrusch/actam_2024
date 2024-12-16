~main.();
SerialPort.closeAll;
SerialPort.devices;


(
~main = {

	// initialise tasks and serial port
	Tdef(\readSerial).stop;

	SerialPort.closeAll;
	~port = SerialPort.new("/dev/cu.usbmodem14201", 9600);

	Tdef(\readSerial, {
	loop{
		var byte, str, res;
		if(~port.read==10,
			{	str = "";
				while(
					{byte = ~port.read; byte!=13},
					{str = str++byte.asAscii}
				);
				res = str.split($ );
				~res=res;
				~res.postln;
			});
	}
	}).play;

}

)