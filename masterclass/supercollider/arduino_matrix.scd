~main.();
SerialPort.closeAll;


(
~main = {

	var scale, trig_threshold, // GUI and matrix properties
	range_min, range_max,
	columns, rows, // user specified
	sound_folder_path, // user specified
	views, views_full, // handle GUI layouts & views
	play_slice, slice_threshold, slice_metric, // inside twoCorpus instrument, but also called at colorCheck rate
	middleRow, threeQuarters; // matrix locations

	scale = 60; // resize matrix window
	trig_threshold = 0.1; // thresh detection on matrix (0-1)
	range_min = 10; // min sensor value mapped
	range_max = 600; // max sensor value mapped

	columns = 6; // number of columns (to digital pins)
	rows = 6; // number of rows (to analog pins)

	// initialise tasks and serial port
	Tdef(\readSerial).stop;
	Tdef(\colorControl).stop;
	Tdef(\colorCheck).stop;

	SerialPort.closeAll;
	~port = SerialPort.new("/dev/tty.usbserial-A703Y978", 115200);

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
			});
	}
	}).play;


	Window.closeAll;

	//w = Window.new("SillyCode", Rect(0,0,width: (Window.screenBounds.width/1.5)+20,height: Window.screenBounds.height)).front;
	w = Window.new("velostat matrix demo", Rect(0,0,
		width: 500,
		height: 500
	)).front; // main window


	s.meter;



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
				scope = ~res[rowStart..rowEnd];

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
							store_index.asFloat.linlin(0,columns-1,0,1), // x
							idx.asFloat.linlin(0,rows-1,1,0), // y
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
/*

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

			});

			0.05.wait;
		}
	}).play;
*/
	w.front;
};
)