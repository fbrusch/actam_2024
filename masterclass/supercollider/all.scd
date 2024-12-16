~main.(); // execute this third


( // execute this first

SerialPort.closeAll;
Server.killAll;
//SerialPort.devices;
Tdef.clear;
Server.default.options.inDevice_("Built-in Microph");
Server.default.options.outDevice_("Scarlett 18i20 USB");
Server.default.options.sampleRate = 44100;
s.options.numOutputBusChannels = 8;
Buffer.freeAll;
~master_ch.free;
~second.free;
//~fx_synth.free;

s.boot;
/*
ServerOptions.outDevices;
Server.default.options.inDevice_("Built-in Microph");
Server.default.options.outDevice_("Built-in Output");
*/
)

(// execute this second

~main = {

	var scale, trig_threshold, // GUI and matrix properties
	range_min, range_max,
	columns, rows, // user specified
	sound_folder_path, // user specified
	views, views_full, // handle GUI layouts & views
	play_slice, slice_threshold, slice_metric, // inside twoCorpus instrument, but also called at colorCheck rate
	middleRow, threeQuarters, // matrix locations
	scale_choose, register;

	// matrix variables
	scale = 60; // resize matrix window
	trig_threshold = 0.4; // thresh detection on matrix (0-1)
	range_min = 10; // min sensor value mapped
	range_max = 600; // max sensor value mapped

	columns = 6; // number of columns (to digital pins)
	rows = 6; // number of rows (to analog pins)


	scale_choose = Scale.choose(6, 12); // make a random 6-notes scale
	register = [0, 12, 24, 36, 48, 60]; // register offsets (6 octaves)

	// reset tasks and initialise serial ports
	Tdef(\readSerial_1).stop;
	Tdef(\readSerial_2).stop;
	Tdef(\colorControl).stop;
	Tdef(\colorCheck).stop;
	//SerialPort.closeAll;
	~port1 = SerialPort.new("/dev/tty.usbserial-A703Y978", 115200);
	~port2 = SerialPort.new("/dev/cu.usbmodem14201", 9600);

	// busses
	~master_bus = Bus.audio(s,8);
	~fx_bus = Bus.audio(s,2);

	// synthdefs

	SynthDef.new(\test, { // test synth
		arg in, out = 2, amp = 0.5;
		var sig;
		sig = SinOsc.ar(440);
		Out.ar(out, sig *amp);
	}).add;

	SynthDef.new(\main_synth, {
		arg in, out=2, freq=440, amp=0.6, gate=1,
		atk=0.1, rel=1;
		var sig, env, envgen;

		sig = LFTri.ar(freq);
		sig = HPF.ar(sig, 30);
		env = Env([0,1,0], [atk, rel]);
		envgen = EnvGen.kr(env, gate, doneAction: Done.freeSelf);
		sig = sig*envgen *amp;

		Out.ar(out, sig);
	}).add;


	SynthDef.new(\second_synth, {
		arg gate=0, ultra, out, amp=0.1;
		var sig, env, gen;
		env = Env.adsr(0.5, 1, 1);
		gen = EnvGen.ar(env, gate, doneAction:0);
		sig = SinOsc.ar(ultra.lag2(0.3))*gen *amp;
		Out.ar(out, sig);
	}).add;


	SynthDef.new(\fx_synth, {
		arg in=~fx_bus, out=~master_bus, lpf=18000,
		ultra=200, radar=0;
		var sig, fm;
		sig = In.ar(in, 2);
		sig = LPF.ar(sig, lpf.lag2(0.5));
		sig = (sig)*0.5;
		Out.ar(out, sig);
	}).add;



	SynthDef.new(\master, { // master channel
		arg in = ~master_bus, main_out = 2;
		// take audio from master bus, send to hardware out 3 (receive from live inch3)
		var sig;
		sig = In.ar(in, 2);
		Out.ar(main_out, sig);
	}).add;


	~fx_ch = Synth.new(\fx_synth, [\in, ~fx_bus, \out, ~master_bus, \lpf, 15000], s, \addToTail);
	~master_ch = Synth.new(\master, [\in, ~master_bus, \main_out, 4], s, \addToTail);

	//~master_ch.free;

	//x = Synth(\test, [\out, ~master_bus]);

	// make a note to test it :)
	~synth_instance = Synth.new(\main_synth, [\out, ~fx_bus, \gate, 1, \atk, 0.1, \rel, 1]);
	~second = Synth.new(\second_synth, [\out, ~master_bus, \gate, 0, \ultra, 400]);
	//~second.set(\gate, 0)

	// tdefs

	Tdef(\readSerial_1, { // read from Arduino Mega
	loop{
		var byte, str, res;
		if(~port1.read==10,
			{	str = "";
				while(
					{byte = ~port1.read; byte!=13},
					{str = str++byte.asAscii}
				);
				res = str.split($ );
				~res1=res;
			});
	}
	}).play;

	Tdef(\readSerial_2, { // read from Arduino Uno
	loop{
		var byte, str, res;
		if(~port2.read==10,
			{	str = "";
				while(
					{byte = ~port2.read; byte!=13},
					{str = str++byte.asAscii}
				);
				res = str.split($ );
				~res2=res;
			});
	}
	}).play;


	// initialise gui

	Window.closeAll;

	w = Window.new("velostat matrix demo", Rect(0,0,
		width: 500,
		height: 500
	)).front; // main window


	// global in/out meter
	s.meter;

	// gui setup

	// creates a series of columns (background black)
	views = (0..5).collect{
		arg m, ind;
		CompositeView(w, Rect(10+(ind*scale), 10,
			width: w.bounds.width/(columns-1)+55,
			height: w.bounds.height-60))
		.background_(Color.gray(0))
	};
	// all views in a composite view
	views_full = views.collect{
		arg o, index;
		rows.collect{
			arg p;
			CompositeView(views[index], Rect(0,0+(p*scale), scale, scale))
			.background_(Color.gray(0.5)) // <-- this is the value to modulate
		}
	};


	// gui related tasks

	// this task updates the GUI at 20ms rate (slower than arduino readings)
	Tdef(\colorControl, {
		loop{

			var colScope, tempRevAvg1, tempRevAvg2, tempFsAvg,
			col_L, col_R, col_l, col_r,
			speaker1, speaker2, speaker3, speaker4,
			sp1_avg, sp2_avg, sp3_avg, sp4_avg,
			grain_duration, ratescale;
			var coor_coll = [];
			~coor_coll = nil;


			views_full.do{
				arg view, index;
				var rowStart, rowEnd,
				shades, store_index, scope,
				coordinates, coor_coll;

				// fragments ~res in as many chunks as rows, to place it in views
				rowStart = index*rows;
				rowEnd = (index*rows)+(rows-1);
				// raw values coming from arduino, in the current chunk
				scope = ~res1[rowStart..rowEnd];

				// map raw values with color intensity
				shades = scope.collect{
					arg j;
					j.asFloat.linlin(range_min,range_max,1,0);
				};

				// store index to use in nested scopes
				store_index = index;



				// check for points exceeding specified threshold
				coordinates = scope.collect{
					arg k, idx;

					if(k.asFloat.linlin(range_min,range_max,1,0) > trig_threshold, {
						var arr =
						[ // if the normalised value exceeds trig_threshold, add coordinates too coor_coll
							store_index.asFloat.linlin(0,columns-1,0,columns-1), // x
							idx.asFloat.linlin(0,rows-1,rows-1,0), // y
							k.asFloat.linlin(range_min,range_max,1,0) // normalised value
						];
						coor_coll = coor_coll.add(arr);
						~coor_coll = coor_coll; // make it global
					});
					// this value will go in coordinates
					k.asFloat.linlin(range_min,range_max,1,0);
				};

				// update grid GUI shades
				views_full[index].do{
					arg currentView, counter;
					{ currentView.background_(Color.gray(shades[counter])) }.defer;
				};

			};

			0.02.wait;
		}
	}).play(AppClock);


	Tdef(\colorCheck, {//observes grid status, plays slices at need
		loop{
			views_full.do{
				arg view, index;
				//var pair, value;

				~pair = ~coor_coll.collect{
					arg item, i;
					[item[0], item[1]]
				};

				~value = ~coor_coll.collect{
					arg item, i;
					item[2]; // this is teh value list of active nodes (same order as pair)
				};
			};


			if(~coor_coll.size != 0, { // if there are coordinates,
				// do something with the coordinates and value
				// (only for trigger based applications)
				var music = []; // empty array for synth instances

				music = ~coor_coll.do{
					arg item, i;
					var synth;
					// make an array of synths depending on cells active
					synth = Synth.new(\main_synth, [
						\out, ~fx_bus,
						\gate, 1,
						\atk, 0.1,
						\rel, 1,
						\freq, ((scale_choose[item[0]] + register[item[1]]) + 12).midicps,
						\amp, item[2]*0.1
					]);

				};

			});

			0.05.wait;
		}
	}).play;


	Tdef(\lpf_pot, { // update FX (lpf)
		loop{
			// update LPF with Uno's readings (pot-radar-ultra)
			~fx_ch.set(
				\lpf, (~res2[0].asFloat.linlin(0,1023,200,18000)),
				//\shift, (~res2[2].asFloat.linlin(5,300,10,15000)),
				//\radar, ~res2[1].asFloat,
				\in, ~fx_bus,
				\out, ~master_bus
			);
			0.05.wait;
		}
	}).play;



	Tdef(\second_update, { // updates second synth gate +
		loop{
			~second.set(
				\gate, ~res2[1].asInteger,
				\ultra, (~res2[2].asFloat.linlin(5,40,3000,100)),
				\amp, 0.1
			);
			0.05.wait;
		}
	}).play;


	w.front;
};
)