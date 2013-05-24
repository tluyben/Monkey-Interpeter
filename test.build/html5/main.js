
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}

	BBMonkeyGame.Main( document.getElementById( "GameCanvas" ) );
}

//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat";
CFG_BRL_GAMETARGET_IMPLEMENTED="1";
CFG_CD="";
CFG_CONFIG="debug";
CFG_HOST="macos";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MODPATH=".;/Users/tluyben/Monkey-Interpeter;/Applications/MonkeyPro70b/modules;/Applications/MonkeyPro70b/targets/html5/modules";
CFG_MOJO_AUTO_SUSPEND_ENABLED="0";
CFG_MONKEYDIR="";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
CFG_TRANSDIR="";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	print( str );
}

function debugStop(){
	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}

function BBGameEvent(){}
BBGameEvent.KeyDown=1;
BBGameEvent.KeyUp=2;
BBGameEvent.KeyChar=3;
BBGameEvent.MouseDown=4;
BBGameEvent.MouseUp=5;
BBGameEvent.MouseMove=6;
BBGameEvent.TouchDown=7;
BBGameEvent.TouchUp=8;
BBGameEvent.TouchMove=9;
BBGameEvent.MotionAccel=10;

function BBGameDelegate(){}
BBGameDelegate.prototype.StartGame=function(){}
BBGameDelegate.prototype.SuspendGame=function(){}
BBGameDelegate.prototype.ResumeGame=function(){}
BBGameDelegate.prototype.UpdateGame=function(){}
BBGameDelegate.prototype.RenderGame=function(){}
BBGameDelegate.prototype.KeyEvent=function( ev,data ){}
BBGameDelegate.prototype.MouseEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.TouchEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.MotionEvent=function( ev,data,x,y,z ){}
BBGameDelegate.prototype.DiscardGraphics=function(){}

function BBGame(){
	BBGame._game=this;
	this._delegate=null;
	this._keyboardEnabled=false;
	this._updateRate=0;
	this._started=false;
	this._suspended=false;
	this._debugExs=(CFG_CONFIG=="debug");
	this._startms=Date.now();
}

BBGame.Game=function(){
	return BBGame._game;
}

BBGame.prototype.SetDelegate=function( delegate ){
	this._delegate=delegate;
}

BBGame.prototype.Delegate=function(){
	return this._delegate;
}

BBGame.prototype.SetUpdateRate=function( updateRate ){
	this._updateRate=updateRate;
}

BBGame.prototype.SetKeyboardEnabled=function( keyboardEnabled ){
	this._keyboardEnabled=keyboardEnabled;
}

BBGame.prototype.Started=function(){
	return this._started;
}

BBGame.prototype.Suspended=function(){
	return this._suspended;
}

BBGame.prototype.Millisecs=function(){
	return Date.now()-this._startms;
}

BBGame.prototype.GetDate=function( date ){
	var n=date.length;
	if( n>0 ){
		var t=new Date();
		date[0]=t.getFullYear();
		if( n>1 ){
			date[1]=t.getMonth()+1;
			if( n>2 ){
				date[2]=t.getDate();
				if( n>3 ){
					date[3]=t.getHours();
					if( n>4 ){
						date[4]=t.getMinutes();
						if( n>5 ){
							date[5]=t.getSeconds();
							if( n>6 ){
								date[6]=t.getMilliseconds();
							}
						}
					}
				}
			}
		}
	}
}

BBGame.prototype.SaveState=function( state ){
	localStorage.setItem( "monkeystate@"+document.URL,state );	//key can't start with dot in Chrome!
	return 1;
}

BBGame.prototype.LoadState=function(){
	var state=localStorage.getItem( "monkeystate@"+document.URL );
	if( state ) return state;
	return "";
}

BBGame.prototype.LoadString=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );
	
	xhr.send( null );
	
	if( xhr.status==200 || xhr.status==0 ) return xhr.responseText;
	
	return "";
}

BBGame.prototype.PollJoystick=function( port,joyx,joyy,joyz,buttons ){
	return false;
}

BBGame.prototype.OpenUrl=function( url ){
	window.location=url;
}

BBGame.prototype.SetMouseVisible=function( visible ){
	if( visible ){
		this._canvas.style.cursor='default';	
	}else{
		this._canvas.style.cursor="url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
	}
}

BBGame.prototype.PathToUrl=function( path ){
	return path;
}

BBGame.prototype.LoadData=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );

	if( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );

	xhr.send( null );
	if( xhr.status!=200 && xhr.status!=0 ) return null;

	var r=xhr.responseText;
	var buf=new ArrayBuffer( r.length );
	var bytes=new Int8Array( buf );
	for( var i=0;i<r.length;++i ){
		bytes[i]=r.charCodeAt( i );
	}
	return buf;
}

//***** INTERNAL ******

BBGame.prototype.Die=function( ex ){

	this._delegate=new BBGameDelegate();
	
	if( !ex.toString() ){
		return;
	}
	
	if( this._debugExs ){
		print( "Monkey Runtime Error : "+ex.toString() );
		print( stackTrace() );
	}
	
	throw ex;
}

BBGame.prototype.StartGame=function(){

	if( this._started ) return;
	this._started=true;
	
	if( this._debugExs ){
		try{
			this._delegate.StartGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.StartGame();
	}
}

BBGame.prototype.SuspendGame=function(){

	if( !this._started || this._suspended ) return;
	this._suspended=true;
	
	if( this._debugExs ){
		try{
			this._delegate.SuspendGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.SuspendGame();
	}
}

BBGame.prototype.ResumeGame=function(){

	if( !this._started || !this._suspended ) return;
	this._suspended=false;
	
	if( this._debugExs ){
		try{
			this._delegate.ResumeGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.ResumeGame();
	}
}

BBGame.prototype.UpdateGame=function(){

	if( !this._started || this._suspended ) return;

	if( this._debugExs ){
		try{
			this._delegate.UpdateGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.UpdateGame();
	}
}

BBGame.prototype.RenderGame=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.RenderGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.RenderGame();
	}
}

BBGame.prototype.KeyEvent=function( ev,data ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.KeyEvent( ev,data );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.KeyEvent( ev,data );
	}
}

BBGame.prototype.MouseEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MouseEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MouseEvent( ev,data,x,y );
	}
}

BBGame.prototype.TouchEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.TouchEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.TouchEvent( ev,data,x,y );
	}
}

BBGame.prototype.MotionEvent=function( ev,data,x,y,z ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MotionEvent( ev,data,x,y,z );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MotionEvent( ev,data,x,y,z );
	}
}

BBGame.prototype.DiscardGraphics=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.DiscardGraphics();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.DiscardGraphics();
	}
}

function BBHtml5Game( canvas ){
	BBGame.call( this );
	BBHtml5Game._game=this;
	this._canvas=canvas;
	this._loading=0;
	this._timerSeq=0;
	this._gl=null;
	if( CFG_OPENGL_GLES20_ENABLED=="1" ){
		this._gl=this._canvas.getContext( "webgl" );
		if( !this._gl ) this._gl=this._canvas.getContext( "experimental-webgl" );
		if( !this._gl ) this.Die( "Can't create WebGL" );
		gl=this._gl;
	}
}

BBHtml5Game.prototype=extend_class( BBGame );

BBHtml5Game.Html5Game=function(){
	return BBHtml5Game._game;
}

BBHtml5Game.prototype.ValidateUpdateTimer=function(){

	++this._timerSeq;

	if( !this._updateRate || this._suspended ) return;
	
	var game=this;
	var updatePeriod=1000.0/this._updateRate;
	var nextUpdate=Date.now()+updatePeriod;
	var seq=game._timerSeq;
	
	function timeElapsed(){
		if( seq!=game._timerSeq ) return;

		var time;		
		var updates;
		
		for( updates=0;updates<4;++updates ){
		
			nextUpdate+=updatePeriod;
			
			game.UpdateGame();
			if( seq!=game._timerSeq ) return;
			
			if( nextUpdate-Date.now()>0 ) break;
		}
		
		game.RenderGame();
		if( seq!=game._timerSeq ) return;
		
		if( updates==4 ){
			nextUpdate=Date.now();
			setTimeout( timeElapsed,0 );
		}else{
			var delay=nextUpdate-Date.now();
			setTimeout( timeElapsed,delay>0 ? delay : 0 );
		}
	}

	setTimeout( timeElapsed,updatePeriod );
}

//***** BBGame methods *****

BBHtml5Game.prototype.SetUpdateRate=function( updateRate ){

	BBGame.prototype.SetUpdateRate.call( this,updateRate );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.GetMetaData=function( path,key ){
	if( path.indexOf( "monkey://data/" )!=0 ) return "";
	path=path.slice(14);

	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

BBHtml5Game.prototype.PathToUrl=function( path ){
	if( path.indexOf( "monkey:" )!=0 ){
		return path;
	}else if( path.indexOf( "monkey://data/" )==0 ) {
		return "data/"+path.slice( 14 );
	}
	return "";
}

BBHtml5Game.prototype.GetLoading=function(){
	return this._loading;
}

BBHtml5Game.prototype.IncLoading=function(){
	++this._loading;
	return this._loading;
}

BBHtml5Game.prototype.DecLoading=function(){
	--this._loading;
	return this._loading;
}

BBHtml5Game.prototype.GetCanvas=function(){
	return this._canvas;
}

BBHtml5Game.prototype.GetWebGL=function(){
	return this._gl;
}

//***** INTERNAL *****

BBHtml5Game.prototype.UpdateGame=function(){

	if( !this._loading ) BBGame.prototype.UpdateGame.call( this );
}

BBHtml5Game.prototype.SuspendGame=function(){

	BBGame.prototype.SuspendGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.ResumeGame=function(){

	BBGame.prototype.ResumeGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.Run=function(){

	var game=this;
	var canvas=game._canvas;
	
	var touchIds=new Array( 32 );
	for( i=0;i<32;++i ) touchIds[i]=-1;
	
	function eatEvent( e ){
		if( e.stopPropagation ){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble=true;
			e.returnValue=false;
		}
	}
	
	function keyToChar( key ){
		switch( key ){
		case 8:case 9:case 13:case 27:case 32:return key;
		case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 45:return key|0x10000;
		case 46:return 127;
		}
		return 0;
	}
	
	function mouseX( e ){
		var x=e.clientX+document.body.scrollLeft;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}
	
	function mouseY( e ){
		var y=e.clientY+document.body.scrollTop;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}

	function touchX( touch ){
		var x=touch.pageX;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}			
	
	function touchY( touch ){
		var y=touch.pageY;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}
	
	canvas.onkeydown=function( e ){
		game.KeyEvent( BBGameEvent.KeyDown,e.keyCode );
		var chr=keyToChar( e.keyCode );
		if( chr ) game.KeyEvent( BBGameEvent.KeyChar,chr );
		if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
	}

	canvas.onkeyup=function( e ){
		game.KeyEvent( BBGameEvent.KeyUp,e.keyCode );
	}

	canvas.onkeypress=function( e ){
		if( e.charCode ){
			game.KeyEvent( BBGameEvent.KeyChar,e.charCode );
		}else if( e.which ){
			game.KeyEvent( BBGameEvent.KeyChar,e.which );
		}
	}

	canvas.onmousedown=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseDown,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseDown,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseDown,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmouseup=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmousemove=function( e ){
		game.MouseEvent( BBGameEvent.MouseMove,-1,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.onmouseout=function( e ){
		game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.ontouchstart=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=-1 ) continue;
				touchIds[j]=touch.identifier;
				game.TouchEvent( BBGameEvent.TouchDown,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchmove=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				game.TouchEvent( BBGameEvent.TouchMove,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchend=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				touchIds[j]=-1;
				game.TouchEvent( BBGameEvent.TouchUp,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	window.ondevicemotion=function( e ){
		var tx=e.accelerationIncludingGravity.x/9.81;
		var ty=e.accelerationIncludingGravity.y/9.81;
		var tz=e.accelerationIncludingGravity.z/9.81;
		var x,y;
		switch( window.orientation ){
		case   0:x=+tx;y=-ty;break;
		case 180:x=-tx;y=+ty;break;
		case  90:x=-ty;y=-tx;break;
		case -90:x=+ty;y=+tx;break;
		}
		game.MotionEvent( BBGameEvent.MotionAccel,0,x,y,tz );
		eatEvent( e );
	}

	canvas.onfocus=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.ResumeGame();
		}
	}
	
	canvas.onblur=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.SuspendGame();
		}
	}
	
	canvas.focus();
	
	game.StartGame();

	game.RenderGame();
}

function BBMonkeyGame( canvas ){
	BBHtml5Game.call( this,canvas );
}

BBMonkeyGame.prototype=extend_class( BBHtml5Game );

BBMonkeyGame.Main=function( canvas ){

	var game=new BBMonkeyGame( canvas );

	try{

		bbInit();
		bbMain();

	}catch( ex ){
	
		game.Die( ex );
		return;
	}

	if( !game.Delegate() ) return;
	
	game.Run();
}
function ExitApp(j) {
	
}function c_Map(){
	Object.call(this);
	this.m_root=null;
}
c_Map.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
c_Map.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map.prototype.p_RotateLeft=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).m_right;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<252>";
	dbg_object(t_node).m_right=dbg_object(t_child).m_left;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).m_left)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).m_left).m_parent=t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<256>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}
	}else{
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<264>";
		this.m_root=t_child;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<266>";
	dbg_object(t_child).m_left=t_node;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<267>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map.prototype.p_RotateRight=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).m_left;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<272>";
	dbg_object(t_node).m_left=dbg_object(t_child).m_right;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).m_right)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).m_right).m_parent=t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<276>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}
	}else{
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<284>";
		this.m_root=t_child;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<286>";
	dbg_object(t_child).m_right=t_node;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<287>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map.prototype.p_InsertFixup=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).m_parent)!=null) && dbg_object(dbg_object(t_node).m_parent).m_color==-1 && ((dbg_object(dbg_object(t_node).m_parent).m_parent)!=null)){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).m_parent==dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_right;
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).m_color==-1){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).m_parent;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<223>";
					this.p_RotateLeft(t_node);
				}
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<227>";
				this.p_RotateRight(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left;
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).m_color==-1){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).m_parent;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<239>";
					this.p_RotateRight(t_node);
				}
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<243>";
				this.p_RotateLeft(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<247>";
	dbg_object(this.m_root).m_color=1;
	pop_err();
	return 0;
}
c_Map.prototype.p_Set=function(t_key,t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<29>";
	var t_node=this.m_root;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<34>";
		t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<40>";
				dbg_object(t_node).m_value=t_value;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<45>";
	t_node=c_Node.m_new.call(new c_Node,t_key,t_value,-1,t_parent);
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).m_right=t_node;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).m_left=t_node;
		}
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<53>";
		this.p_InsertFixup(t_node);
	}else{
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<55>";
		this.m_root=t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
c_Map.prototype.p_FindNode=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<157>";
	var t_node=this.m_root;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<160>";
		var t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
c_Map.prototype.p_Get=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<101>";
	var t_node=this.p_FindNode(t_key);
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).m_value;
	}
	pop_err();
	return "";
}
c_Map.prototype.p_FirstNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<137>";
	if(!((this.m_root)!=null)){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<137>";
		pop_err();
		return null;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<139>";
	var t_node=this.m_root;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<140>";
	while((dbg_object(t_node).m_left)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<141>";
		t_node=dbg_object(t_node).m_left;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<143>";
	pop_err();
	return t_node;
}
c_Map.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<121>";
	var t_=c_NodeEnumerator.m_new.call(new c_NodeEnumerator,this.p_FirstNode());
	pop_err();
	return t_;
}
c_Map.prototype.p_Contains=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<25>";
	var t_=this.p_FindNode(t_key)!=null;
	pop_err();
	return t_;
}
function c_StringMap(){
	c_Map.call(this);
}
c_StringMap.prototype=extend_class(c_Map);
c_StringMap.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<551>";
	c_Map.m_new.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
c_StringMap.prototype.p_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
var bb_config__cfgVars=null;
function c_Node(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value="";
	this.m_color=0;
	this.m_parent=null;
}
c_Node.m_new=function(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<364>";
	dbg_object(this).m_key=t_key;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<365>";
	dbg_object(this).m_value=t_value;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<366>";
	dbg_object(this).m_color=t_color;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<367>";
	dbg_object(this).m_parent=t_parent;
	pop_err();
	return this;
}
c_Node.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
c_Node.prototype.p_NextNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<385>";
	var t_node=null;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<386>";
	if((this.m_right)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<387>";
		t_node=this.m_right;
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<388>";
		while((dbg_object(t_node).m_left)!=null){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<389>";
			t_node=dbg_object(t_node).m_left;
		}
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<391>";
		pop_err();
		return t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<393>";
	t_node=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<394>";
	var t_parent=dbg_object(this).m_parent;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<395>";
	while(((t_parent)!=null) && t_node==dbg_object(t_parent).m_right){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<396>";
		t_node=t_parent;
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<397>";
		t_parent=dbg_object(t_parent).m_parent;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<399>";
	pop_err();
	return t_parent;
}
c_Node.prototype.p_Key=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<377>";
	pop_err();
	return this.m_key;
}
c_Node.prototype.p_Value=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<381>";
	pop_err();
	return this.m_value;
}
function bb_config_SetCfgVar(t_key,t_val){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<18>";
	bb_config__cfgVars.p_Set(t_key,t_val);
	pop_err();
	return 0;
}
var bb_config_ENV_HOST="";
function c_List(){
	Object.call(this);
	this.m__head=(c_HeadNode.m_new.call(new c_HeadNode));
}
c_List.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List.prototype.p_AddLast=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<126>";
	var t_=c_Node2.m_new.call(new c_Node2,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<14>";
		this.p_AddLast(t_t);
	}
	pop_err();
	return this;
}
c_List.prototype.p_Equals=function(t_lhs,t_rhs){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<28>";
	var t_=t_lhs==t_rhs;
	pop_err();
	return t_;
}
c_List.prototype.p_Contains=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<54>";
	var t_node=dbg_object(this.m__head).m__succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<55>";
	while(t_node!=this.m__head){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<56>";
		if(this.p_Equals(dbg_object(t_node).m__data,t_value)){
			err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<56>";
			pop_err();
			return true;
		}
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<57>";
		t_node=dbg_object(t_node).m__succ;
	}
	pop_err();
	return false;
}
c_List.prototype.p_IsEmpty=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<50>";
	var t_=dbg_object(this.m__head).m__succ==this.m__head;
	pop_err();
	return t_;
}
c_List.prototype.p_RemoveLast=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<94>";
	if(this.p_IsEmpty()){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<94>";
		error("Illegal operation on empty list");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<96>";
	var t_data=dbg_object(this.m__head.p_PrevNode()).m__data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<97>";
	dbg_object(this.m__head).m__pred.p_Remove();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<98>";
	pop_err();
	return t_data;
}
function c_StringList(){
	c_List.call(this);
}
c_StringList.prototype=extend_class(c_List);
c_StringList.m_new=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<413>";
	c_List.m_new2.call(this,t_data);
	pop_err();
	return this;
}
c_StringList.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<410>";
	c_List.m_new.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<410>";
	pop_err();
	return this;
}
c_StringList.prototype.p_Equals=function(t_lhs,t_rhs){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<421>";
	var t_=t_lhs==t_rhs;
	pop_err();
	return t_;
}
function c_Node2(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data="";
}
c_Node2.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<243>";
	this.m__succ=t_succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<244>";
	this.m__pred=t_pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<245>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<246>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<247>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node2.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<240>";
	pop_err();
	return this;
}
c_Node2.prototype.p_GetNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<283>";
	pop_err();
	return this;
}
c_Node2.prototype.p_PrevNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<271>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<271>";
		error("Illegal operation on removed node");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<273>";
	var t_=this.m__pred.p_GetNode();
	pop_err();
	return t_;
}
c_Node2.prototype.p_Remove=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<256>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<256>";
		error("Illegal operation on removed node");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<258>";
	dbg_object(this.m__succ).m__pred=this.m__pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<259>";
	dbg_object(this.m__pred).m__succ=this.m__succ;
	pop_err();
	return 0;
}
function c_HeadNode(){
	c_Node2.call(this);
}
c_HeadNode.prototype=extend_class(c_Node2);
c_HeadNode.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<292>";
	c_Node2.m_new2.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<293>";
	this.m__succ=(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<294>";
	this.m__pred=(this);
	pop_err();
	return this;
}
c_HeadNode.prototype.p_GetNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<298>";
	pop_err();
	return null;
}
function c_Decl(){
	Object.call(this);
	this.m_errInfo="";
	this.m_ident="";
	this.m_attrs=0;
	this.m_munged="";
	this.m_scope=null;
}
c_Decl.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<50>";
	this.m_errInfo=bb_config__errInfo;
	pop_err();
	return this;
}
c_Decl.prototype.p_IsSemanted=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<79>";
	var t_=(((this.m_attrs&1048576)!=0)?1:0);
	pop_err();
	return t_;
}
c_Decl.prototype.p_IsAbstract=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<75>";
	var t_=(((this.m_attrs&1024)!=0)?1:0);
	pop_err();
	return t_;
}
c_Decl.prototype.p_IsExtern=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<63>";
	var t_=(((this.m_attrs&256)!=0)?1:0);
	pop_err();
	return t_;
}
c_Decl.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<58>";
	if((object_downcast((this.m_scope),c_ClassDecl))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<58>";
		var t_=this.m_scope.p_ToString()+"."+this.m_ident;
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<59>";
	pop_err();
	return this.m_ident;
}
c_Decl.prototype.p_IsPrivate=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<67>";
	var t_=(((this.m_attrs&512)!=0)?1:0);
	pop_err();
	return t_;
}
c_Decl.prototype.p_ModuleScope=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<97>";
	if((object_downcast((this),c_ModuleDecl))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<97>";
		var t_=object_downcast((this),c_ModuleDecl);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<98>";
	if((this.m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<98>";
		var t_2=this.m_scope.p_ModuleScope();
		pop_err();
		return t_2;
	}
	pop_err();
	return null;
}
c_Decl.prototype.p_FuncScope=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<87>";
	if((object_downcast((this),c_FuncDecl))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<87>";
		var t_=object_downcast((this),c_FuncDecl);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<88>";
	if((this.m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<88>";
		var t_2=this.m_scope.p_FuncScope();
		pop_err();
		return t_2;
	}
	pop_err();
	return null;
}
c_Decl.prototype.p_CheckAccess=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<107>";
	if(((this.p_IsPrivate())!=0) && this.p_ModuleScope()!=bb_decl__env.p_ModuleScope()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<108>";
		var t_fdecl=bb_decl__env.p_FuncScope();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<109>";
		if(((t_fdecl)!=null) && ((dbg_object(t_fdecl).m_attrs&8388608)!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<109>";
			pop_err();
			return 1;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<110>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<112>";
	pop_err();
	return 1;
}
c_Decl.prototype.p_IsSemanting=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<83>";
	var t_=(((this.m_attrs&2097152)!=0)?1:0);
	pop_err();
	return t_;
}
c_Decl.prototype.p_OnSemant=function(){
}
c_Decl.prototype.p_AppScope=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<102>";
	if((object_downcast((this),c_AppDecl))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<102>";
		var t_=object_downcast((this),c_AppDecl);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<103>";
	if((this.m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<103>";
		var t_2=this.m_scope.p_AppScope();
		pop_err();
		return t_2;
	}
	pop_err();
	return null;
}
c_Decl.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<129>";
	if((this.p_IsSemanted())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<129>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<131>";
	if((this.p_IsSemanting())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<131>";
		bb_config_Err("Cyclic declaration of '"+this.m_ident+"'.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<133>";
	var t_cscope=object_downcast((this.m_scope),c_ClassDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<135>";
	if((t_cscope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<135>";
		dbg_object(t_cscope).m_attrs&=-5;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<137>";
	bb_config_PushErr(this.m_errInfo);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<139>";
	if((this.m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<140>";
		bb_decl_PushEnv(this.m_scope);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<143>";
	this.m_attrs|=2097152;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<147>";
	this.p_OnSemant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<149>";
	this.m_attrs&=-2097153;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<151>";
	this.m_attrs|=1048576;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<153>";
	if((this.m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<154>";
		if((this.p_IsExtern())!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<155>";
			if((object_downcast((this.m_scope),c_ModuleDecl))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<156>";
				dbg_object(this.p_AppScope()).m_allSemantedDecls.p_AddLast2(this);
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<160>";
			dbg_object(this.m_scope).m_semanted.p_AddLast2(this);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<162>";
			if((object_downcast((this),c_GlobalDecl))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<163>";
				dbg_object(this.p_AppScope()).m_semantedGlobals.p_AddLast6(object_downcast((this),c_GlobalDecl));
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<166>";
			if((object_downcast((this.m_scope),c_ModuleDecl))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<167>";
				dbg_object(this.p_AppScope()).m_semanted.p_AddLast2(this);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<168>";
				dbg_object(this.p_AppScope()).m_allSemantedDecls.p_AddLast2(this);
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<173>";
		bb_decl_PopEnv();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<176>";
	bb_config_PopErr();
	pop_err();
	return 0;
}
c_Decl.prototype.p_AssertAccess=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<116>";
	if(!((this.p_CheckAccess())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<117>";
		bb_config_Err(this.p_ToString()+" is private.");
	}
	pop_err();
	return 0;
}
c_Decl.prototype.p_ClassScope=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<92>";
	if((object_downcast((this),c_ClassDecl))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<92>";
		var t_=object_downcast((this),c_ClassDecl);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<93>";
	if((this.m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<93>";
		var t_2=this.m_scope.p_ClassScope();
		pop_err();
		return t_2;
	}
	pop_err();
	return null;
}
c_Decl.prototype.p_IsFinal=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<71>";
	var t_=(((this.m_attrs&2048)!=0)?1:0);
	pop_err();
	return t_;
}
c_Decl.prototype.p_OnCopy=function(){
}
c_Decl.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<122>";
	var t_t=this.p_OnCopy();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<123>";
	dbg_object(t_t).m_munged=this.m_munged;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<124>";
	dbg_object(t_t).m_errInfo=this.m_errInfo;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<125>";
	pop_err();
	return t_t;
}
function c_ScopeDecl(){
	c_Decl.call(this);
	this.m_decls=c_List2.m_new.call(new c_List2);
	this.m_declsMap=c_StringMap2.m_new.call(new c_StringMap2);
	this.m_semanted=c_List2.m_new.call(new c_List2);
}
c_ScopeDecl.prototype=extend_class(c_Decl);
c_ScopeDecl.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<330>";
	c_Decl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<330>";
	pop_err();
	return this;
}
c_ScopeDecl.prototype.p_InsertDecl=function(t_decl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<393>";
	if((dbg_object(t_decl).m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<393>";
		bb_config_InternalErr("Internal error");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<395>";
	var t_ident=dbg_object(t_decl).m_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<396>";
	if(!((t_ident).length!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<396>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<398>";
	dbg_object(t_decl).m_scope=this;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<399>";
	this.m_decls.p_AddLast2(t_decl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<401>";
	var t_decls=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<402>";
	var t_tdecl=this.m_declsMap.p_Get(t_ident);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<404>";
	if((object_downcast((t_decl),c_FuncDecl))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<405>";
		var t_funcs=object_downcast((t_tdecl),c_FuncDeclList);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<406>";
		if(((t_funcs)!=null) || !((t_tdecl)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<407>";
			if(!((t_funcs)!=null)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<408>";
				t_funcs=c_FuncDeclList.m_new.call(new c_FuncDeclList);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<409>";
				this.m_declsMap.p_Insert2(t_ident,(t_funcs));
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<411>";
			t_funcs.p_AddLast3(object_downcast((t_decl),c_FuncDecl));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<413>";
			bb_config_Err("Duplicate identifier '"+t_ident+"'.");
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<415>";
		if(!((t_tdecl)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<416>";
			this.m_declsMap.p_Insert2(t_ident,(t_decl));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<418>";
			bb_config_Err("Duplicate identifier '"+t_ident+"'.");
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<421>";
	if((t_decl.p_IsSemanted())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<421>";
		this.m_semanted.p_AddLast2(t_decl);
	}
	pop_err();
	return 0;
}
c_ScopeDecl.prototype.p_GetDecl=function(t_ident){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<433>";
	var t_decl=this.m_declsMap.p_Get(t_ident);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<434>";
	if(!((t_decl)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<434>";
		pop_err();
		return null;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<436>";
	var t_adecl=object_downcast((t_decl),c_AliasDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<437>";
	if(!((t_adecl)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<437>";
		pop_err();
		return t_decl;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<439>";
	if((t_adecl.p_CheckAccess())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<439>";
		pop_err();
		return dbg_object(t_adecl).m_decl;
	}
	pop_err();
	return null;
}
c_ScopeDecl.prototype.p_FindDecl=function(t_ident){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<444>";
	if(bb_decl__env!=this){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<444>";
		var t_=this.p_GetDecl(t_ident);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<446>";
	var t_tscope=this;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<447>";
	while((t_tscope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<448>";
		var t_decl=t_tscope.p_GetDecl(t_ident);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<449>";
		if((t_decl)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<449>";
			pop_err();
			return t_decl;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<450>";
		t_tscope=dbg_object(t_tscope).m_scope;
	}
	pop_err();
	return null;
}
c_ScopeDecl.prototype.p_FindFuncDecl=function(t_ident,t_argExprs,t_explicit){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<515>";
	var t_funcs=object_downcast((this.p_FindDecl(t_ident)),c_FuncDeclList);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<516>";
	if(!((t_funcs)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<516>";
		pop_err();
		return null;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<518>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<518>";
	var t_=t_funcs.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<518>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<518>";
		var t_func=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<519>";
		t_func.p_Semant();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<522>";
	var t_match=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<522>";
	var t_isexact=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<522>";
	var t_err="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<524>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<524>";
	var t_2=t_funcs.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<524>";
	while(t_2.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<524>";
		var t_func2=t_2.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<525>";
		if(!((t_func2.p_CheckAccess())!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<525>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<527>";
		var t_argDecls=dbg_object(t_func2).m_argDecls;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<529>";
		if(t_argExprs.length>t_argDecls.length){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<529>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<531>";
		var t_exact=1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<532>";
		var t_possible=1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<534>";
		for(var t_i=0;t_i<t_argDecls.length;t_i=t_i+1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<536>";
			if(t_i<t_argExprs.length && ((dbg_array(t_argExprs,t_i)[dbg_index])!=null)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<538>";
				var t_declTy=dbg_object(dbg_array(t_argDecls,t_i)[dbg_index]).m_type;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<539>";
				var t_exprTy=dbg_object(dbg_array(t_argExprs,t_i)[dbg_index]).m_exprType;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<541>";
				if((t_exprTy.p_EqualsType(t_declTy))!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<541>";
					continue;
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<543>";
				t_exact=0;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<545>";
				if(!((t_explicit)!=0) && ((t_exprTy.p_ExtendsType(t_declTy))!=0)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<545>";
					continue;
				}
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<547>";
				if((dbg_object(dbg_array(t_argDecls,t_i)[dbg_index]).m_init)!=null){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<550>";
					if(!((t_explicit)!=0)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<550>";
						continue;
					}
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<554>";
			t_possible=0;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<555>";
			break;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<558>";
		if(!((t_possible)!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<558>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<560>";
		if((t_exact)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<561>";
			if((t_isexact)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<562>";
				bb_config_Err("Unable to determine overload to use: "+t_match.p_ToString()+" or "+t_func2.p_ToString()+".");
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<564>";
				t_err="";
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<565>";
				t_match=t_func2;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<566>";
				t_isexact=1;
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<569>";
			if(!((t_isexact)!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<570>";
				if((t_match)!=null){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<571>";
					t_err="Unable to determine overload to use: "+t_match.p_ToString()+" or "+t_func2.p_ToString()+".";
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<573>";
					t_match=t_func2;
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<580>";
	if(!((t_isexact)!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<581>";
		if((t_err).length!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<581>";
			bb_config_Err(t_err);
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<582>";
		if((t_explicit)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<582>";
			pop_err();
			return null;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<585>";
	if(!((t_match)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<586>";
		var t_t="";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<587>";
		for(var t_i2=0;t_i2<t_argExprs.length;t_i2=t_i2+1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<588>";
			if((t_t).length!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<588>";
				t_t=t_t+",";
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<589>";
			if((dbg_array(t_argExprs,t_i2)[dbg_index])!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<589>";
				t_t=t_t+dbg_object(dbg_array(t_argExprs,t_i2)[dbg_index]).m_exprType.p_ToString();
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<591>";
		bb_config_Err("Unable to find overload for "+t_ident+"("+t_t+").");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<594>";
	t_match.p_AssertAccess();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<596>";
	pop_err();
	return t_match;
}
c_ScopeDecl.prototype.p_InsertDecls=function(t_decls){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<426>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<426>";
	var t_=t_decls.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<426>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<426>";
		var t_decl=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<427>";
		this.p_InsertDecl(t_decl);
	}
	pop_err();
	return 0;
}
c_ScopeDecl.prototype.p_OnSemant=function(){
	push_err();
	pop_err();
	return 0;
}
c_ScopeDecl.prototype.p_MethodDecls=function(t_id){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<363>";
	var t_fdecls=c_List3.m_new.call(new c_List3);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<364>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<364>";
	var t_=this.m_decls.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<364>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<364>";
		var t_decl=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<365>";
		if(((t_id).length!=0) && dbg_object(t_decl).m_ident!=t_id){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<365>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<366>";
		var t_fdecl=object_downcast((t_decl),c_FuncDecl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<367>";
		if(((t_fdecl)!=null) && t_fdecl.p_IsMethod()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<367>";
			t_fdecls.p_AddLast3(t_fdecl);
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<369>";
	pop_err();
	return t_fdecls;
}
c_ScopeDecl.prototype.p_Semanted=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<349>";
	pop_err();
	return this.m_semanted;
}
c_ScopeDecl.prototype.p_SemantedMethods=function(t_id){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<383>";
	var t_fdecls=c_List3.m_new.call(new c_List3);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<384>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<384>";
	var t_=this.m_semanted.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<384>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<384>";
		var t_decl=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<385>";
		if(((t_id).length!=0) && dbg_object(t_decl).m_ident!=t_id){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<385>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<386>";
		var t_fdecl=object_downcast((t_decl),c_FuncDecl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<387>";
		if(((t_fdecl)!=null) && t_fdecl.p_IsMethod()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<387>";
			t_fdecls.p_AddLast3(t_fdecl);
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<389>";
	pop_err();
	return t_fdecls;
}
c_ScopeDecl.prototype.p_SemantedFuncs=function(t_id){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<373>";
	var t_fdecls=c_List3.m_new.call(new c_List3);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<374>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<374>";
	var t_=this.m_semanted.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<374>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<374>";
		var t_decl=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<375>";
		if(((t_id).length!=0) && dbg_object(t_decl).m_ident!=t_id){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<375>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<376>";
		var t_fdecl=object_downcast((t_decl),c_FuncDecl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<377>";
		if((t_fdecl)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<377>";
			t_fdecls.p_AddLast3(t_fdecl);
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<379>";
	pop_err();
	return t_fdecls;
}
c_ScopeDecl.prototype.p_FindType=function(t_ident,t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<468>";
	var t_decl=this.p_GetDecl(t_ident);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<469>";
	if((t_decl)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<470>";
		var t_type=object_downcast((t_decl),c_Type);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<471>";
		if((t_type)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<472>";
			if((t_args.length)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<472>";
				bb_config_Err("Wrong number of type arguments");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<473>";
			pop_err();
			return t_type;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<475>";
		var t_cdecl=object_downcast((t_decl),c_ClassDecl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<476>";
		if((t_cdecl)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<477>";
			t_cdecl.p_AssertAccess();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<478>";
			t_cdecl=t_cdecl.p_GenClassInstance(t_args);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<479>";
			t_cdecl.p_Semant();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<480>";
			var t_=(dbg_object(t_cdecl).m_objectType);
			pop_err();
			return t_;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<483>";
	if((this.m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<483>";
		var t_2=this.m_scope.p_FindType(t_ident,t_args);
		pop_err();
		return t_2;
	}
	pop_err();
	return null;
}
c_ScopeDecl.prototype.p_FindModuleDecl=function(t_ident){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<504>";
	var t_decl=object_downcast((this.p_GetDecl(t_ident)),c_ModuleDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<505>";
	if((t_decl)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<506>";
		t_decl.p_AssertAccess();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<507>";
		t_decl.p_Semant();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<508>";
		pop_err();
		return t_decl;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<510>";
	if((this.m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<510>";
		var t_=this.m_scope.p_FindModuleDecl(t_ident);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
c_ScopeDecl.prototype.p_FindValDecl=function(t_ident){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<460>";
	var t_decl=object_downcast((this.p_FindDecl(t_ident)),c_ValDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<461>";
	if(!((t_decl)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<461>";
		pop_err();
		return null;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<462>";
	t_decl.p_AssertAccess();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<463>";
	t_decl.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<464>";
	pop_err();
	return t_decl;
}
c_ScopeDecl.prototype.p_Decls=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<345>";
	pop_err();
	return this.m_decls;
}
c_ScopeDecl.prototype.p_FindScopeDecl=function(t_ident){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<487>";
	var t_decl=this.p_FindDecl(t_ident);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<488>";
	var t_type=object_downcast((t_decl),c_Type);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<489>";
	if((t_type)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<490>";
		if(!((object_downcast((t_type),c_ObjectType))!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<490>";
			pop_err();
			return null;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<491>";
		var t_=(t_type.p_GetClass());
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<493>";
	var t_scope=object_downcast((t_decl),c_ScopeDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<494>";
	if((t_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<495>";
		var t_cdecl=object_downcast((t_scope),c_ClassDecl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<496>";
		if(((t_cdecl)!=null) && ((dbg_object(t_cdecl).m_args).length!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<496>";
			pop_err();
			return null;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<497>";
		t_scope.p_AssertAccess();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<498>";
		t_scope.p_Semant();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<499>";
		pop_err();
		return t_scope;
	}
	pop_err();
	return null;
}
c_ScopeDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<341>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return null;
}
c_ScopeDecl.prototype.p_FuncDecls=function(t_id){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<353>";
	var t_fdecls=c_List3.m_new.call(new c_List3);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<354>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<354>";
	var t_=this.m_decls.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<354>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<354>";
		var t_decl=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<355>";
		if(((t_id).length!=0) && dbg_object(t_decl).m_ident!=t_id){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<355>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<356>";
		var t_fdecl=object_downcast((t_decl),c_FuncDecl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<357>";
		if((t_fdecl)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<357>";
			t_fdecls.p_AddLast3(t_fdecl);
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<359>";
	pop_err();
	return t_fdecls;
}
function c_AppDecl(){
	c_ScopeDecl.call(this);
	this.m_imported=c_StringMap3.m_new.call(new c_StringMap3);
	this.m_mainModule=null;
	this.m_allSemantedDecls=c_List2.m_new.call(new c_List2);
	this.m_semantedGlobals=c_List6.m_new.call(new c_List6);
	this.m_fileImports=c_StringList.m_new2.call(new c_StringList);
	this.m_mainFunc=null;
	this.m_semantedClasses=c_List7.m_new.call(new c_List7);
}
c_AppDecl.prototype=extend_class(c_ScopeDecl);
c_AppDecl.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1321>";
	c_ScopeDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1321>";
	pop_err();
	return this;
}
c_AppDecl.prototype.p_InsertModule=function(t_mdecl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1335>";
	dbg_object(t_mdecl).m_scope=(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1336>";
	this.m_imported.p_Insert3(dbg_object(t_mdecl).m_filepath,t_mdecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1337>";
	if(!((this.m_mainModule)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1338>";
		this.m_mainModule=t_mdecl;
	}
	pop_err();
	return 0;
}
c_AppDecl.prototype.p_FinalizeClasses=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1359>";
	bb_decl__env=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1361>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1362>";
		var t_more=0;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1363>";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1363>";
		var t_=this.m_semantedClasses.p_ObjectEnumerator();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1363>";
		while(t_.p_HasNext()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1363>";
			var t_cdecl=t_.p_NextObject();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1364>";
			t_more+=t_cdecl.p_UpdateLiveMethods();
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1366>";
		if(!((t_more)!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1366>";
			break;
		}
	}while(!(false));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1369>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1369>";
	var t_2=this.m_semantedClasses.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1369>";
	while(t_2.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1369>";
		var t_cdecl2=t_2.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1370>";
		t_cdecl2.p_FinalizeClass();
	}
	pop_err();
	return 0;
}
c_AppDecl.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1344>";
	bb_decl__env=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1346>";
	this.m_mainFunc=this.m_mainModule.p_FindFuncDecl("Main",[],0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1348>";
	if(!((this.m_mainFunc)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1348>";
		bb_config_Err("Function 'Main' not found.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1350>";
	if(!((object_downcast((dbg_object(this.m_mainFunc).m_retType),c_IntType))!=null) || ((dbg_object(this.m_mainFunc).m_argDecls.length)!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1351>";
		bb_config_Err("Main function must be of type Main:Int()");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1354>";
	this.p_FinalizeClasses();
	pop_err();
	return 0;
}
var bb_config__errInfo="";
function c_ModuleDecl(){
	c_ScopeDecl.call(this);
	this.m_filepath="";
	this.m_imported=c_StringMap3.m_new.call(new c_StringMap3);
	this.m_pubImported=c_StringMap3.m_new.call(new c_StringMap3);
}
c_ModuleDecl.prototype=extend_class(c_ScopeDecl);
c_ModuleDecl.m_new=function(t_ident,t_attrs,t_munged,t_filepath){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1230>";
	c_ScopeDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1231>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1232>";
	dbg_object(this).m_attrs=t_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1233>";
	dbg_object(this).m_munged=t_munged;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1234>";
	dbg_object(this).m_filepath=t_filepath;
	pop_err();
	return this;
}
c_ModuleDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1220>";
	c_ScopeDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1220>";
	pop_err();
	return this;
}
c_ModuleDecl.prototype.p_IsStrict=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1238>";
	var t_=(((this.m_attrs&1)!=0)?1:0);
	pop_err();
	return t_;
}
c_ModuleDecl.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1227>";
	var t_="Module "+this.m_munged;
	pop_err();
	return t_;
}
c_ModuleDecl.prototype.p_GetDecl2=function(t_ident){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1283>";
	var t_=c_ScopeDecl.prototype.p_GetDecl.call(this,t_ident);
	pop_err();
	return t_;
}
c_ModuleDecl.prototype.p_GetDecl=function(t_ident){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1243>";
	var t_todo=c_List9.m_new.call(new c_List9);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1244>";
	var t_done=c_StringMap3.m_new.call(new c_StringMap3);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1246>";
	t_todo.p_AddLast9(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1247>";
	t_done.p_Insert3(this.m_filepath,this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1249>";
	var t_decl=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1249>";
	var t_declmod="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1251>";
	while(!t_todo.p_IsEmpty()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1253>";
		var t_mdecl=t_todo.p_RemoveLast();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1254>";
		var t_tdecl=t_mdecl.p_GetDecl2(t_ident);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1256>";
		if(((t_tdecl)!=null) && t_tdecl!=t_decl){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1257>";
			if(t_mdecl==this){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1257>";
				pop_err();
				return t_tdecl;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1258>";
			if((t_decl)!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1259>";
				bb_config_Err("Duplicate identifier '"+t_ident+"' found in module '"+t_declmod+"' and module '"+dbg_object(t_mdecl).m_ident+"'.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1261>";
			t_decl=t_tdecl;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1262>";
			t_declmod=dbg_object(t_mdecl).m_ident;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1265>";
		if(!((bb_decl__env)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1265>";
			break;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1267>";
		var t_imps=dbg_object(t_mdecl).m_imported;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1268>";
		if(t_mdecl!=bb_decl__env.p_ModuleScope()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1268>";
			t_imps=dbg_object(t_mdecl).m_pubImported;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1270>";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1270>";
		var t_=t_imps.p_Values().p_ObjectEnumerator();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1270>";
		while(t_.p_HasNext()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1270>";
			var t_mdecl2=t_.p_NextObject();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1271>";
			if(!t_done.p_Contains(dbg_object(t_mdecl2).m_filepath)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1272>";
				t_todo.p_AddLast9(t_mdecl2);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1273>";
				t_done.p_Insert3(dbg_object(t_mdecl2).m_filepath,t_mdecl2);
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1279>";
	pop_err();
	return t_decl;
}
c_ModuleDecl.prototype.p_OnSemant=function(){
	push_err();
	pop_err();
	return 0;
}
function c_Toker(){
	Object.call(this);
	this.m__path="";
	this.m__line=0;
	this.m__source="";
	this.m__length=0;
	this.m__toke="";
	this.m__tokeType=0;
	this.m__tokePos=0;
}
c_Toker.m__keywords=null;
c_Toker.m__symbols=null;
c_Toker.prototype.p__init=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<36>";
	if((c_Toker.m__keywords)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<36>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<47>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<49>";
	c_Toker.m__keywords=c_StringSet.m_new.call(new c_StringSet);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<50>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<50>";
	var t_="void strict public private property bool int float string array object mod continue exit include import module extern new self super eachin true false null not extends abstract final select case default const local global field method function class and or shl shr end if then else elseif endif while wend repeat until forever for to step next return interface implements inline alias try catch throw throwable".split(" ");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<50>";
	var t_2=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<50>";
	while(t_2<t_.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<50>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<50>";
		t_2=t_2+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<51>";
		c_Toker.m__keywords.p_Insert(t_t);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<53>";
	c_Toker.m__symbols=c_StringSet.m_new.call(new c_StringSet);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<54>";
	c_Toker.m__symbols.p_Insert("..");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<55>";
	c_Toker.m__symbols.p_Insert(":=");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<56>";
	c_Toker.m__symbols.p_Insert("*=");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<57>";
	c_Toker.m__symbols.p_Insert("/=");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<58>";
	c_Toker.m__symbols.p_Insert("+=");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<59>";
	c_Toker.m__symbols.p_Insert("-=");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<60>";
	c_Toker.m__symbols.p_Insert("|=");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<61>";
	c_Toker.m__symbols.p_Insert("&=");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<62>";
	c_Toker.m__symbols.p_Insert("~=");
	pop_err();
	return 0;
}
c_Toker.m_new=function(t_path,t_source){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<66>";
	this.p__init();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<67>";
	this.m__path=t_path;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<68>";
	this.m__line=1;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<69>";
	this.m__source=t_source;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<70>";
	this.m__length=this.m__source.length;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<71>";
	this.m__toke="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<72>";
	this.m__tokeType=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<73>";
	this.m__tokePos=0;
	pop_err();
	return this;
}
c_Toker.m_new2=function(t_toker){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<77>";
	this.p__init();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<78>";
	this.m__path=dbg_object(t_toker).m__path;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<79>";
	this.m__line=dbg_object(t_toker).m__line;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<80>";
	this.m__source=dbg_object(t_toker).m__source;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<81>";
	this.m__length=this.m__source.length;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<82>";
	this.m__toke=dbg_object(t_toker).m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<83>";
	this.m__tokeType=dbg_object(t_toker).m__tokeType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<84>";
	this.m__tokePos=dbg_object(t_toker).m__tokePos;
	pop_err();
	return this;
}
c_Toker.m_new3=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<22>";
	pop_err();
	return this;
}
c_Toker.prototype.p_Path=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<88>";
	pop_err();
	return this.m__path;
}
c_Toker.prototype.p_Line=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<92>";
	pop_err();
	return this.m__line;
}
c_Toker.prototype.p_TCHR=function(t_i){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<213>";
	t_i+=this.m__tokePos;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<214>";
	if(t_i<this.m__length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<214>";
		var t_=this.m__source.charCodeAt(t_i);
		pop_err();
		return t_;
	}
	pop_err();
	return 0;
}
c_Toker.prototype.p_TSTR=function(t_i){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<218>";
	t_i+=this.m__tokePos;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<219>";
	if(t_i<this.m__length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<219>";
		var t_=this.m__source.slice(t_i,t_i+1);
		pop_err();
		return t_;
	}
	pop_err();
	return "";
}
c_Toker.prototype.p_NextToke=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<97>";
	this.m__toke="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<99>";
	if(this.m__tokePos==this.m__length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<100>";
		this.m__tokeType=0;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<101>";
		pop_err();
		return this.m__toke;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<104>";
	var t_chr=this.p_TCHR(0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<105>";
	var t_str=this.p_TSTR(0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<106>";
	var t_start=this.m__tokePos;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<107>";
	this.m__tokePos+=1;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<109>";
	if(t_str=="\n"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<110>";
		this.m__tokeType=8;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<111>";
		this.m__line+=1;
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<112>";
		if((bb_config_IsSpace(t_chr))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<113>";
			this.m__tokeType=1;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<114>";
			while(this.m__tokePos<this.m__length && ((bb_config_IsSpace(this.p_TCHR(0)))!=0) && this.p_TSTR(0)!="\n"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<115>";
				this.m__tokePos+=1;
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<117>";
			if(t_str=="_" || ((bb_config_IsAlpha(t_chr))!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<118>";
				this.m__tokeType=2;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<119>";
				while(this.m__tokePos<this.m__length){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<120>";
					var t_chr2=this.m__source.charCodeAt(this.m__tokePos);
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<121>";
					if(t_chr2!=95 && !((bb_config_IsAlpha(t_chr2))!=0) && !((bb_config_IsDigit(t_chr2))!=0)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<121>";
						break;
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<123>";
					this.m__tokePos+=1;
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<125>";
				this.m__toke=this.m__source.slice(t_start,this.m__tokePos);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<126>";
				if(c_Toker.m__keywords.p_Contains(this.m__toke.toLowerCase())){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<126>";
					this.m__tokeType=3;
				}
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<127>";
				if(((bb_config_IsDigit(t_chr))!=0) || t_str=="." && ((bb_config_IsDigit(this.p_TCHR(0)))!=0)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<128>";
					this.m__tokeType=4;
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<129>";
					if(t_str=="."){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<129>";
						this.m__tokeType=5;
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<130>";
					while((bb_config_IsDigit(this.p_TCHR(0)))!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<131>";
						this.m__tokePos+=1;
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<133>";
					if(this.m__tokeType==4 && this.p_TSTR(0)=="." && ((bb_config_IsDigit(this.p_TCHR(1)))!=0)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<134>";
						this.m__tokeType=5;
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<135>";
						this.m__tokePos+=2;
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<136>";
						while((bb_config_IsDigit(this.p_TCHR(0)))!=0){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<137>";
							this.m__tokePos+=1;
						}
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<140>";
					if(this.p_TSTR(0).toLowerCase()=="e"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<141>";
						this.m__tokeType=5;
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<142>";
						this.m__tokePos+=1;
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<143>";
						if(this.p_TSTR(0)=="+" || this.p_TSTR(0)=="-"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<143>";
							this.m__tokePos+=1;
						}
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<144>";
						while((bb_config_IsDigit(this.p_TCHR(0)))!=0){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<145>";
							this.m__tokePos+=1;
						}
					}
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<148>";
					if(t_str=="%" && ((bb_config_IsBinDigit(this.p_TCHR(0)))!=0)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<149>";
						this.m__tokeType=4;
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<150>";
						this.m__tokePos+=1;
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<151>";
						while((bb_config_IsBinDigit(this.p_TCHR(0)))!=0){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<152>";
							this.m__tokePos+=1;
						}
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<154>";
						if(t_str=="$" && ((bb_config_IsHexDigit(this.p_TCHR(0)))!=0)){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<155>";
							this.m__tokeType=4;
							err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<156>";
							this.m__tokePos+=1;
							err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<157>";
							while((bb_config_IsHexDigit(this.p_TCHR(0)))!=0){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<158>";
								this.m__tokePos+=1;
							}
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<160>";
							if(t_str=="\""){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<161>";
								this.m__tokeType=6;
								err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<162>";
								while(this.m__tokePos<this.m__length && this.p_TSTR(0)!="\""){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<163>";
									this.m__tokePos+=1;
								}
								err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<165>";
								if(this.m__tokePos<this.m__length){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<165>";
									this.m__tokePos+=1;
								}else{
									err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<165>";
									this.m__tokeType=7;
								}
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<166>";
								if(t_str=="'"){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<167>";
									this.m__tokeType=9;
									err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<168>";
									while(this.m__tokePos<this.m__length && this.p_TSTR(0)!="\n"){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<169>";
										this.m__tokePos+=1;
									}
									err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<171>";
									if(this.m__tokePos<this.m__length){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<172>";
										this.m__tokePos+=1;
										err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<173>";
										this.m__line+=1;
									}
								}else{
									err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<175>";
									if(t_str=="["){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<176>";
										this.m__tokeType=8;
										err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<177>";
										var t_i=0;
										err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<178>";
										while(this.m__tokePos+t_i<this.m__length){
											err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<179>";
											if(this.p_TSTR(t_i)=="]"){
												err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<180>";
												this.m__tokePos+=t_i+1;
												err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<181>";
												break;
											}
											err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<183>";
											if(this.p_TSTR(t_i)=="\n" || !((bb_config_IsSpace(this.p_TCHR(t_i)))!=0)){
												err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<183>";
												break;
											}
											err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<184>";
											t_i+=1;
										}
									}else{
										err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<187>";
										this.m__tokeType=8;
										err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<188>";
										if(c_Toker.m__symbols.p_Contains(this.m__source.slice(this.m__tokePos-1,this.m__tokePos+1))){
											err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<188>";
											this.m__tokePos+=1;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<191>";
	if(!((this.m__toke).length!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<191>";
		this.m__toke=this.m__source.slice(t_start,this.m__tokePos);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<193>";
	pop_err();
	return this.m__toke;
}
c_Toker.prototype.p_TokeType=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<201>";
	pop_err();
	return this.m__tokeType;
}
c_Toker.prototype.p_Toke=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<197>";
	pop_err();
	return this.m__toke;
}
c_Toker.prototype.p_SkipSpace=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<205>";
	while(this.m__tokeType==1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/toker.monkey<206>";
		this.p_NextToke();
	}
	pop_err();
	return 0;
}
function c_Set(){
	Object.call(this);
	this.m_map=null;
}
c_Set.m_new=function(t_map){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/set.monkey<16>";
	dbg_object(this).m_map=t_map;
	pop_err();
	return this;
}
c_Set.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/set.monkey<13>";
	pop_err();
	return this;
}
c_Set.prototype.p_Insert=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/set.monkey<36>";
	this.m_map.p_Insert2(t_value,null);
	pop_err();
	return 0;
}
c_Set.prototype.p_Contains=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/set.monkey<32>";
	var t_=this.m_map.p_Contains(t_value);
	pop_err();
	return t_;
}
function c_StringSet(){
	c_Set.call(this);
}
c_StringSet.prototype=extend_class(c_Set);
c_StringSet.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/set.monkey<69>";
	c_Set.m_new.call(this,(c_StringMap2.m_new.call(new c_StringMap2)));
	pop_err();
	return this;
}
function c_Map2(){
	Object.call(this);
	this.m_root=null;
}
c_Map2.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
c_Map2.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map2.prototype.p_RotateLeft2=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).m_right;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<252>";
	dbg_object(t_node).m_right=dbg_object(t_child).m_left;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).m_left)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).m_left).m_parent=t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<256>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}
	}else{
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<264>";
		this.m_root=t_child;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<266>";
	dbg_object(t_child).m_left=t_node;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<267>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map2.prototype.p_RotateRight2=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).m_left;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<272>";
	dbg_object(t_node).m_left=dbg_object(t_child).m_right;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).m_right)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).m_right).m_parent=t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<276>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}
	}else{
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<284>";
		this.m_root=t_child;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<286>";
	dbg_object(t_child).m_right=t_node;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<287>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map2.prototype.p_InsertFixup2=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).m_parent)!=null) && dbg_object(dbg_object(t_node).m_parent).m_color==-1 && ((dbg_object(dbg_object(t_node).m_parent).m_parent)!=null)){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).m_parent==dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_right;
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).m_color==-1){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).m_parent;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<223>";
					this.p_RotateLeft2(t_node);
				}
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<227>";
				this.p_RotateRight2(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left;
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).m_color==-1){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).m_parent;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<239>";
					this.p_RotateRight2(t_node);
				}
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<243>";
				this.p_RotateLeft2(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<247>";
	dbg_object(this.m_root).m_color=1;
	pop_err();
	return 0;
}
c_Map2.prototype.p_Set2=function(t_key,t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<29>";
	var t_node=this.m_root;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<34>";
		t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<40>";
				dbg_object(t_node).m_value=t_value;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<45>";
	t_node=c_Node3.m_new.call(new c_Node3,t_key,t_value,-1,t_parent);
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).m_right=t_node;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).m_left=t_node;
		}
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<53>";
		this.p_InsertFixup2(t_node);
	}else{
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<55>";
		this.m_root=t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
c_Map2.prototype.p_Insert2=function(t_key,t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<126>";
	var t_=this.p_Set2(t_key,t_value);
	pop_err();
	return t_;
}
c_Map2.prototype.p_FindNode=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<157>";
	var t_node=this.m_root;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<160>";
		var t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
c_Map2.prototype.p_Contains=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<25>";
	var t_=this.p_FindNode(t_key)!=null;
	pop_err();
	return t_;
}
c_Map2.prototype.p_Get=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<101>";
	var t_node=this.p_FindNode(t_key);
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).m_value;
	}
	pop_err();
	return null;
}
function c_StringMap2(){
	c_Map2.call(this);
}
c_StringMap2.prototype=extend_class(c_Map2);
c_StringMap2.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<551>";
	c_Map2.m_new.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
c_StringMap2.prototype.p_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
function c_Node3(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node3.m_new=function(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<364>";
	dbg_object(this).m_key=t_key;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<365>";
	dbg_object(this).m_value=t_value;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<366>";
	dbg_object(this).m_color=t_color;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<367>";
	dbg_object(this).m_parent=t_parent;
	pop_err();
	return this;
}
c_Node3.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function c_Parser(){
	Object.call(this);
	this.m__toke="";
	this.m__toker=null;
	this.m__app=null;
	this.m__options=null;
	this.m__module=null;
	this.m__defattrs=0;
	this.m__tokeType=0;
	this.m__block=null;
	this.m__blockStack=c_List8.m_new.call(new c_List8);
	this.m__errStack=c_StringList.m_new2.call(new c_StringList);
}
c_Parser.prototype.p_SetErr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<361>";
	if((this.m__toker.p_Path()).length!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<361>";
		bb_config__errInfo=this.m__toker.p_Path()+"<"+String(this.m__toker.p_Line())+">";
	}
	pop_err();
	return 0;
}
c_Parser.prototype.p_CParse=function(t_toke){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<415>";
	if(this.m__toke!=t_toke){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<416>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<418>";
	this.p_NextToke();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<419>";
	pop_err();
	return 1;
}
c_Parser.prototype.p_SkipEols=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<433>";
	while((this.p_CParse("\n"))!=0){
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<435>";
	this.p_SetErr();
	pop_err();
	return 0;
}
c_Parser.prototype.p_NextToke=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<392>";
	var t_toke=this.m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<394>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<395>";
		this.m__toke=this.m__toker.p_NextToke();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<396>";
		this.m__tokeType=this.m__toker.p_TokeType();
	}while(!(this.m__tokeType!=1));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<399>";
	var t_=this.m__tokeType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<400>";
	if(t_==3){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<401>";
		this.m__toke=this.m__toke.toLowerCase();
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<402>";
		if(t_==8){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<403>";
			if(this.m__toke.charCodeAt(0)==91 && this.m__toke.charCodeAt(this.m__toke.length-1)==93){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<405>";
				this.m__toke="[]";
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<409>";
	if(t_toke==","){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<409>";
		this.p_SkipEols();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<411>";
	pop_err();
	return this.m__toke;
}
c_Parser.m_new=function(t_toker,t_app,t_mdecl,t_defattrs,t_options){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1782>";
	this.m__toke="\n";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1783>";
	this.m__toker=t_toker;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1784>";
	this.m__app=t_app;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1785>";
	if(t_options==null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1785>";
		t_options=c_StringList.m_new2.call(new c_StringList);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1786>";
	this.m__options=t_options;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1787>";
	this.m__module=t_mdecl;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1788>";
	this.m__defattrs=t_defattrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1789>";
	print("hier daaan?");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1790>";
	pop_err();
	return this;
}
c_Parser.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<343>";
	pop_err();
	return this;
}
c_Parser.prototype.p_ValidateModIdent=function(t_id){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1634>";
	if((t_id.length)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1635>";
		if(((bb_config_IsAlpha(t_id.charCodeAt(0)))!=0) || t_id.charCodeAt(0)==95){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1636>";
			var t_err=0;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1637>";
			for(var t_i=1;t_i<t_id.length;t_i=t_i+1){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1638>";
				if(((bb_config_IsAlpha(t_id.charCodeAt(t_i)))!=0) || ((bb_config_IsDigit(t_id.charCodeAt(t_i)))!=0) || t_id.charCodeAt(t_i)==95){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1638>";
					continue;
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1639>";
				t_err=1;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1640>";
				break;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1642>";
			if(!((t_err)!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1642>";
				pop_err();
				return 0;
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1645>";
	bb_config_Err("Invalid module identifier '"+t_id+"'.");
	pop_err();
	return 0;
}
c_Parser.prototype.p_RealPath=function(t_path){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<384>";
	var t_popDir=CurrentDir();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<385>";
	ChangeDir(bb_os_ExtractDir(this.m__toker.p_Path()));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<386>";
	t_path=RealPath(t_path);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<387>";
	ChangeDir(t_popDir);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<388>";
	pop_err();
	return t_path;
}
c_Parser.prototype.p_Parse=function(t_toke){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<423>";
	if(!((this.p_CParse(t_toke))!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<424>";
		bb_config_Err("Syntax error - expecting '"+t_toke+"'.");
	}
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseArrayExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<548>";
	this.p_Parse("[");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<549>";
	var t_args=c_Stack2.m_new.call(new c_Stack2);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<550>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<551>";
		t_args.p_Push4(this.p_ParseExpr());
	}while(!(!((this.p_CParse(","))!=0)));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<553>";
	this.p_Parse("]");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<554>";
	var t_=c_ArrayExpr.m_new.call(new c_ArrayExpr,t_args.p_ToArray());
	pop_err();
	return t_;
}
c_Parser.prototype.p_CParsePrimitiveType=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<460>";
	if((this.p_CParse("void"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<460>";
		var t_=(c_Type.m_voidType);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<461>";
	if((this.p_CParse("bool"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<461>";
		var t_2=(c_Type.m_boolType);
		pop_err();
		return t_2;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<462>";
	if((this.p_CParse("int"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<462>";
		var t_3=(c_Type.m_intType);
		pop_err();
		return t_3;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<463>";
	if((this.p_CParse("float"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<463>";
		var t_4=(c_Type.m_floatType);
		pop_err();
		return t_4;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<464>";
	if((this.p_CParse("string"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<464>";
		var t_5=(c_Type.m_stringType);
		pop_err();
		return t_5;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<465>";
	if((this.p_CParse("object"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<465>";
		var t_6=(c_Type.m_objectType);
		pop_err();
		return t_6;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<466>";
	if((this.p_CParse("throwable"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<466>";
		var t_7=(c_Type.m_throwableType);
		pop_err();
		return t_7;
	}
	pop_err();
	return null;
}
c_Parser.prototype.p_ParseIdent=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<446>";
	var t_=this.m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<447>";
	if(t_=="@"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<448>";
		this.p_NextToke();
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<449>";
		if(t_=="object" || t_=="throwable"){
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<452>";
			if(this.m__tokeType!=2){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<452>";
				bb_config_Err("Syntax error - expecting identifier.");
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<454>";
	var t_id=this.m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<455>";
	this.p_NextToke();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<456>";
	pop_err();
	return t_id;
}
c_Parser.prototype.p_ParseIdentType=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<476>";
	var t_id=this.p_ParseIdent();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<477>";
	if((this.p_CParse("."))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<477>";
		t_id=t_id+("."+this.p_ParseIdent());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<478>";
	var t_args=c_Stack3.m_new.call(new c_Stack3);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<479>";
	if((this.p_CParse("<"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<480>";
		do{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<481>";
			var t_arg=this.p_ParseType();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<482>";
			while((this.p_CParse("[]"))!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<483>";
				t_arg=(t_arg.p_ArrayOf());
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<485>";
			t_args.p_Push7(t_arg);
		}while(!(!((this.p_CParse(","))!=0)));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<487>";
		this.p_Parse(">");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<489>";
	var t_=c_IdentType.m_new.call(new c_IdentType,t_id,t_args.p_ToArray());
	pop_err();
	return t_;
}
c_Parser.prototype.p_ParseType=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<470>";
	var t_ty=this.p_CParsePrimitiveType();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<471>";
	if((t_ty)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<471>";
		pop_err();
		return t_ty;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<472>";
	var t_=(this.p_ParseIdentType());
	pop_err();
	return t_;
}
c_Parser.prototype.p_AtEos=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<429>";
	var t_=((this.m__toke=="" || this.m__toke==";" || this.m__toke=="\n" || this.m__toke=="else")?1:0);
	pop_err();
	return t_;
}
c_Parser.prototype.p_ParseArgs=function(t_stmt){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<559>";
	var t_args=[];
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<561>";
	if((t_stmt)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<562>";
		if((this.p_AtEos())!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<562>";
			pop_err();
			return t_args;
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<564>";
		if(this.m__toke!="("){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<564>";
			pop_err();
			return t_args;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<567>";
	var t_nargs=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<567>";
	var t_eat=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<569>";
	if(this.m__toke=="("){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<570>";
		if((t_stmt)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<571>";
			var t_toker=c_Toker.m_new2.call(new c_Toker,this.m__toker);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<571>";
			var t_bra=1;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<572>";
			do{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<573>";
				t_toker.p_NextToke();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<574>";
				t_toker.p_SkipSpace();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<575>";
				var t_=t_toker.p_Toke().toLowerCase();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<576>";
				if(t_=="" || t_=="else"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<577>";
					bb_config_Err("Parenthesis mismatch error.");
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<578>";
					if(t_=="(" || t_=="["){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<579>";
						t_bra+=1;
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<580>";
						if(t_=="]" || t_==")"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<581>";
							t_bra-=1;
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<582>";
							if((t_bra)!=0){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<582>";
								continue;
							}
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<583>";
							t_toker.p_NextToke();
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<584>";
							t_toker.p_SkipSpace();
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<585>";
							var t_2=t_toker.p_Toke().toLowerCase();
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<586>";
							if(t_2=="." || t_2=="(" || t_2=="[" || t_2=="" || t_2==";" || t_2=="\n" || t_2=="else"){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<587>";
								t_eat=1;
							}
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<589>";
							break;
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<590>";
							if(t_==","){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<591>";
								if(t_bra!=1){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<591>";
									continue;
								}
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<592>";
								t_eat=1;
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<593>";
								break;
							}
						}
					}
				}
			}while(!(false));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<597>";
			t_eat=1;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<599>";
		if(((t_eat)!=0) && this.p_NextToke()==")"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<600>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<601>";
			pop_err();
			return t_args;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<605>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<606>";
		var t_arg=null;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<607>";
		if(((this.m__toke).length!=0) && this.m__toke!=","){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<607>";
			t_arg=this.p_ParseExpr();
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<608>";
		if(t_args.length==t_nargs){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<608>";
			t_args=resize_object_array(t_args,t_nargs+10);
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<609>";
		dbg_array(t_args,t_nargs)[dbg_index]=t_arg
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<610>";
		t_nargs+=1;
	}while(!(!((this.p_CParse(","))!=0)));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<612>";
	t_args=t_args.slice(0,t_nargs);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<614>";
	if((t_eat)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<614>";
		this.p_Parse(")");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<616>";
	pop_err();
	return t_args;
}
c_Parser.prototype.p_CParseIdentType=function(t_inner){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<493>";
	if(this.m__tokeType!=2){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<493>";
		pop_err();
		return null;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<494>";
	var t_id=this.p_ParseIdent();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<495>";
	if((this.p_CParse("."))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<496>";
		if(this.m__tokeType!=2){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<496>";
			pop_err();
			return null;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<497>";
		t_id=t_id+("."+this.p_ParseIdent());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<499>";
	if(!((this.p_CParse("<"))!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<500>";
		if(t_inner){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<500>";
			var t_=c_IdentType.m_new.call(new c_IdentType,t_id,[]);
			pop_err();
			return t_;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<501>";
		pop_err();
		return null;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<503>";
	var t_args=c_Stack3.m_new.call(new c_Stack3);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<504>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<505>";
		var t_arg=this.p_CParsePrimitiveType();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<506>";
		if(!((t_arg)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<507>";
			t_arg=(this.p_CParseIdentType(true));
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<508>";
			if(!((t_arg)!=null)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<508>";
				pop_err();
				return null;
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<510>";
		while((this.p_CParse("[]"))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<511>";
			t_arg=(t_arg.p_ArrayOf());
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<513>";
		t_args.p_Push7(t_arg);
	}while(!(!((this.p_CParse(","))!=0)));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<515>";
	if(!((this.p_CParse(">"))!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<515>";
		pop_err();
		return null;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<516>";
	var t_2=c_IdentType.m_new.call(new c_IdentType,t_id,t_args.p_ToArray());
	pop_err();
	return t_2;
}
c_Parser.prototype.p_ParsePrimaryExpr=function(t_stmt){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<621>";
	var t_expr=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<623>";
	var t_=this.m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<624>";
	if(t_=="("){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<625>";
		this.p_NextToke();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<626>";
		t_expr=this.p_ParseExpr();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<627>";
		this.p_Parse(")");
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<628>";
		if(t_=="["){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<629>";
			t_expr=(this.p_ParseArrayExpr());
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<630>";
			if(t_=="[]"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<631>";
				this.p_NextToke();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<632>";
				t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_emptyArrayType),""));
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<633>";
				if(t_=="."){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<634>";
					t_expr=(c_ScopeExpr.m_new.call(new c_ScopeExpr,(this.m__module)));
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<635>";
					if(t_=="new"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<636>";
						this.p_NextToke();
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<637>";
						var t_ty=this.p_ParseType();
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<638>";
						if((this.p_CParse("["))!=0){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<639>";
							var t_len=this.p_ParseExpr();
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<640>";
							this.p_Parse("]");
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<641>";
							while((this.p_CParse("[]"))!=0){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<642>";
								t_ty=(t_ty.p_ArrayOf());
							}
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<644>";
							t_expr=(c_NewArrayExpr.m_new.call(new c_NewArrayExpr,t_ty,t_len));
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<646>";
							t_expr=(c_NewObjectExpr.m_new.call(new c_NewObjectExpr,t_ty,this.p_ParseArgs(t_stmt)));
						}
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<648>";
						if(t_=="null"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<649>";
							this.p_NextToke();
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<650>";
							t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_nullObjectType),""));
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<651>";
							if(t_=="true"){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<652>";
								this.p_NextToke();
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<653>";
								t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_boolType),"1"));
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<654>";
								if(t_=="false"){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<655>";
									this.p_NextToke();
									err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<656>";
									t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_boolType),""));
								}else{
									err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<657>";
									if(t_=="bool" || t_=="int" || t_=="float" || t_=="string" || t_=="object" || t_=="throwable"){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<658>";
										var t_id=this.m__toke;
										err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<659>";
										var t_ty2=this.p_ParseType();
										err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<660>";
										if(((this.p_CParse("("))!=0)){
											err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<661>";
											t_expr=this.p_ParseExpr();
											err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<662>";
											this.p_Parse(")");
											err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<663>";
											t_expr=(c_CastExpr.m_new.call(new c_CastExpr,t_ty2,t_expr,1));
										}else{
											err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<665>";
											t_expr=(c_IdentExpr.m_new.call(new c_IdentExpr,t_id,null));
										}
									}else{
										err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<667>";
										if(t_=="self"){
											err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<668>";
											this.p_NextToke();
											err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<669>";
											t_expr=(c_SelfExpr.m_new.call(new c_SelfExpr));
										}else{
											err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<670>";
											if(t_=="super"){
												err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<671>";
												this.p_NextToke();
												err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<672>";
												this.p_Parse(".");
												err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<673>";
												if(this.m__toke=="new"){
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<674>";
													this.p_NextToke();
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<675>";
													var t_func=object_downcast((this.m__block),c_FuncDecl);
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<676>";
													if(!((t_func)!=null) || !((t_stmt)!=0) || !t_func.p_IsCtor() || !dbg_object(t_func).m_stmts.p_IsEmpty()){
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<677>";
														bb_config_Err("Call to Super.new must be first statement in a constructor.");
													}
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<679>";
													t_expr=(c_InvokeSuperExpr.m_new.call(new c_InvokeSuperExpr,"new",this.p_ParseArgs(t_stmt)));
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<680>";
													dbg_object(t_func).m_attrs|=8;
												}else{
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<682>";
													var t_id2=this.p_ParseIdent();
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<683>";
													t_expr=(c_InvokeSuperExpr.m_new.call(new c_InvokeSuperExpr,t_id2,this.p_ParseArgs(t_stmt)));
												}
											}else{
												err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<686>";
												var t_2=this.m__tokeType;
												err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<687>";
												if(t_2==2){
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<689>";
													var t_toker=c_Toker.m_new2.call(new c_Toker,this.m__toker);
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<691>";
													var t_ty3=this.p_CParseIdentType(false);
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<692>";
													if((t_ty3)!=null){
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<693>";
														t_expr=(c_IdentTypeExpr.m_new.call(new c_IdentTypeExpr,(t_ty3)));
													}else{
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<695>";
														this.m__toker=t_toker;
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<696>";
														this.m__toke=this.m__toker.p_Toke();
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<697>";
														this.m__tokeType=this.m__toker.p_TokeType();
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<698>";
														t_expr=(c_IdentExpr.m_new.call(new c_IdentExpr,this.p_ParseIdent(),null));
													}
												}else{
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<701>";
													if(t_2==4){
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<702>";
														t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_intType),this.m__toke));
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<703>";
														this.p_NextToke();
													}else{
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<704>";
														if(t_2==5){
															err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<705>";
															t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_floatType),this.m__toke));
															err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<706>";
															this.p_NextToke();
														}else{
															err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<707>";
															if(t_2==6){
																err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<708>";
																t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_stringType),bb_config_Dequote(this.m__toke,"monkey")));
																err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<709>";
																this.p_NextToke();
															}else{
																err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<711>";
																bb_config_Err("Syntax error - unexpected token '"+this.m__toke+"'");
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<715>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<717>";
		var t_3=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<718>";
		if(t_3=="."){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<720>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<721>";
			if(true){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<733>";
				var t_id3=this.p_ParseIdent();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<734>";
				t_expr=(c_IdentExpr.m_new.call(new c_IdentExpr,t_id3,t_expr));
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<737>";
			if(t_3=="("){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<739>";
				t_expr=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,t_expr,this.p_ParseArgs(t_stmt)));
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<741>";
				if(t_3=="["){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<743>";
					this.p_NextToke();
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<744>";
					if((this.p_CParse(".."))!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<745>";
						if(this.m__toke=="]"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<746>";
							t_expr=(c_SliceExpr.m_new.call(new c_SliceExpr,t_expr,null,null));
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<748>";
							t_expr=(c_SliceExpr.m_new.call(new c_SliceExpr,t_expr,null,this.p_ParseExpr()));
						}
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<751>";
						var t_from=this.p_ParseExpr();
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<752>";
						if((this.p_CParse(".."))!=0){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<753>";
							if(this.m__toke=="]"){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<754>";
								t_expr=(c_SliceExpr.m_new.call(new c_SliceExpr,t_expr,t_from,null));
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<756>";
								t_expr=(c_SliceExpr.m_new.call(new c_SliceExpr,t_expr,t_from,this.p_ParseExpr()));
							}
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<759>";
							t_expr=(c_IndexExpr.m_new.call(new c_IndexExpr,t_expr,t_from));
						}
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<762>";
					this.p_Parse("]");
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<764>";
					pop_err();
					return t_expr;
				}
			}
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseUnaryExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<771>";
	this.p_SkipEols();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<772>";
	var t_op=this.m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<773>";
	var t_=t_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<774>";
	if(t_=="+" || t_=="-" || t_=="~" || t_=="not"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<775>";
		this.p_NextToke();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<776>";
		var t_expr=this.p_ParseUnaryExpr();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<777>";
		var t_2=(c_UnaryExpr.m_new.call(new c_UnaryExpr,t_op,t_expr));
		pop_err();
		return t_2;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<779>";
	var t_3=this.p_ParsePrimaryExpr(0);
	pop_err();
	return t_3;
}
c_Parser.prototype.p_ParseMulDivExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<783>";
	var t_expr=this.p_ParseUnaryExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<784>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<785>";
		var t_op=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<786>";
		var t_=t_op;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<787>";
		if(t_=="*" || t_=="/" || t_=="mod" || t_=="shl" || t_=="shr"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<788>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<789>";
			var t_rhs=this.p_ParseUnaryExpr();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<790>";
			t_expr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_op,t_expr,t_rhs));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<792>";
			pop_err();
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseAddSubExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<798>";
	var t_expr=this.p_ParseMulDivExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<799>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<800>";
		var t_op=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<801>";
		var t_=t_op;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<802>";
		if(t_=="+" || t_=="-"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<803>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<804>";
			var t_rhs=this.p_ParseMulDivExpr();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<805>";
			t_expr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_op,t_expr,t_rhs));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<807>";
			pop_err();
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseBitandExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<813>";
	var t_expr=this.p_ParseAddSubExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<814>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<815>";
		var t_op=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<816>";
		var t_=t_op;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<817>";
		if(t_=="&" || t_=="~"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<818>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<819>";
			var t_rhs=this.p_ParseAddSubExpr();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<820>";
			t_expr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_op,t_expr,t_rhs));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<822>";
			pop_err();
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseBitorExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<828>";
	var t_expr=this.p_ParseBitandExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<829>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<830>";
		var t_op=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<831>";
		var t_=t_op;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<832>";
		if(t_=="|"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<833>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<834>";
			var t_rhs=this.p_ParseBitandExpr();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<835>";
			t_expr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_op,t_expr,t_rhs));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<837>";
			pop_err();
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseCompareExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<843>";
	var t_expr=this.p_ParseBitorExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<844>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<845>";
		var t_op=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<846>";
		var t_=t_op;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<847>";
		if(t_=="=" || t_=="<" || t_==">" || t_=="<=" || t_==">=" || t_=="<>"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<848>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<849>";
			if(t_op==">" && this.m__toke=="="){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<850>";
				t_op=t_op+this.m__toke;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<851>";
				this.p_NextToke();
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<852>";
				if(t_op=="<" && (this.m__toke=="=" || this.m__toke==">")){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<853>";
					t_op=t_op+this.m__toke;
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<854>";
					this.p_NextToke();
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<856>";
			var t_rhs=this.p_ParseBitorExpr();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<857>";
			t_expr=(c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,t_op,t_expr,t_rhs));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<859>";
			pop_err();
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseAndExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<865>";
	var t_expr=this.p_ParseCompareExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<866>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<867>";
		var t_op=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<868>";
		if(t_op=="and"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<869>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<870>";
			var t_rhs=this.p_ParseCompareExpr();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<871>";
			t_expr=(c_BinaryLogicExpr.m_new.call(new c_BinaryLogicExpr,t_op,t_expr,t_rhs));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<873>";
			pop_err();
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseOrExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<879>";
	var t_expr=this.p_ParseAndExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<880>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<881>";
		var t_op=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<882>";
		if(t_op=="or"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<883>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<884>";
			var t_rhs=this.p_ParseAndExpr();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<885>";
			t_expr=(c_BinaryLogicExpr.m_new.call(new c_BinaryLogicExpr,t_op,t_expr,t_rhs));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<887>";
			pop_err();
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseExpr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<893>";
	var t_=this.p_ParseOrExpr();
	pop_err();
	return t_;
}
c_Parser.prototype.p_ImportModule=function(t_modpath,t_attrs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1583>";
	if(this.m__options.p_Contains("ignoreModules")){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1583>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1585>";
	var t_filepath="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1587>";
	var t_cd=CurrentDir();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1588>";
	ChangeDir(bb_os_ExtractDir(this.m__toker.p_Path()));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1590>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1590>";
	var t_=bb_config_GetCfgVar("MODPATH").split(";");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1590>";
	var t_2=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1590>";
	while(t_2<t_.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1590>";
		var t_dir=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1590>";
		t_2=t_2+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1591>";
		if(!((t_dir).length!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1591>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1593>";
		t_filepath=this.p_RealPath(t_dir)+"/"+string_replace(t_modpath,".","/")+"."+bb_parser_FILE_EXT;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1594>";
		var t_filepath2=bb_os_StripExt(t_filepath)+"/"+bb_os_StripDir(t_filepath);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1596>";
		if(FileType(t_filepath)==1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1597>";
			if(FileType(t_filepath2)!=1){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1597>";
				break;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1598>";
			bb_config_Err("Duplicate module file: '"+t_filepath+"' and '"+t_filepath2+"'.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1601>";
		t_filepath=t_filepath2;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1602>";
		if(FileType(t_filepath)==1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1602>";
			break;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1604>";
		t_filepath="";
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1607>";
	ChangeDir(t_cd);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1609>";
	if(!((t_filepath).length!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1609>";
		bb_config_Err("Module '"+t_modpath+"' not found.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1617>";
	if(dbg_object(this.m__module).m_imported.p_Contains(t_filepath)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1617>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1619>";
	var t_mdecl=dbg_object(this.m__app).m_imported.p_ValueForKey(t_filepath);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1621>";
	if(!((t_mdecl)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1622>";
		t_mdecl=bb_parser_ParseModule(t_filepath,this.m__app);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1625>";
	dbg_object(this.m__module).m_imported.p_Insert3(dbg_object(t_mdecl).m_filepath,t_mdecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1627>";
	if(!((t_attrs&512)!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1627>";
		dbg_object(this.m__module).m_pubImported.p_Insert3(dbg_object(t_mdecl).m_filepath,t_mdecl);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1629>";
	this.m__module.p_InsertDecl(c_AliasDecl.m_new.call(new c_AliasDecl,dbg_object(t_mdecl).m_ident,t_attrs,(t_mdecl)));
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseStringLit=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<439>";
	if(this.m__tokeType!=6){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<439>";
		bb_config_Err("Expecting string literal.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<440>";
	var t_str=bb_config_Dequote(this.m__toke,"monkey");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<441>";
	this.p_NextToke();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<442>";
	pop_err();
	return t_str;
}
c_Parser.prototype.p_ImportFile=function(t_filepath){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1566>";
	if((bb_config_ENV_SAFEMODE)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1567>";
		if(dbg_object(this.m__app).m_mainModule==this.m__module){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1568>";
			bb_config_Err("Import of external files not permitted in safe mode.");
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1572>";
	t_filepath=this.p_RealPath(t_filepath);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1574>";
	if(FileType(t_filepath)!=1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1575>";
		bb_config_Err("File '"+t_filepath+"' not found.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1578>";
	dbg_object(this.m__app).m_fileImports.p_AddLast(t_filepath);
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseModPath=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1551>";
	var t_path=this.p_ParseIdent();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1552>";
	while((this.p_CParse("."))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1553>";
		t_path=t_path+("."+this.p_ParseIdent());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1555>";
	pop_err();
	return t_path;
}
c_Parser.prototype.p_ParseDeclType=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<520>";
	var t_ty=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<521>";
	var t_=this.m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<522>";
	if(t_=="?"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<523>";
		this.p_NextToke();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<524>";
		t_ty=(c_Type.m_boolType);
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<525>";
		if(t_=="%"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<526>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<527>";
			t_ty=(c_Type.m_intType);
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<528>";
			if(t_=="#"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<529>";
				this.p_NextToke();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<530>";
				t_ty=(c_Type.m_floatType);
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<531>";
				if(t_=="$"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<532>";
					this.p_NextToke();
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<533>";
					t_ty=(c_Type.m_stringType);
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<534>";
					if(t_==":"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<535>";
						this.p_NextToke();
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<536>";
						t_ty=this.p_ParseType();
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<538>";
						if((this.m__module.p_IsStrict())!=0){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<538>";
							bb_config_Err("Illegal type expression.");
						}
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<539>";
						t_ty=(c_Type.m_intType);
					}
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<541>";
	while((this.p_CParse("[]"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<542>";
		t_ty=(t_ty.p_ArrayOf());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<544>";
	pop_err();
	return t_ty;
}
c_Parser.prototype.p_ParseDecl=function(t_toke,t_attrs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1278>";
	this.p_SetErr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1279>";
	var t_id=this.p_ParseIdent();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1280>";
	var t_ty=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1281>";
	var t_init=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1282>";
	if((t_attrs&256)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1283>";
		t_ty=this.p_ParseDeclType();
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1284>";
		if((this.p_CParse(":="))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1285>";
			t_init=this.p_ParseExpr();
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1287>";
			t_ty=this.p_ParseDeclType();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1288>";
			if((this.p_CParse("="))!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1289>";
				t_init=this.p_ParseExpr();
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1290>";
				if((this.p_CParse("["))!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1291>";
					var t_len=this.p_ParseExpr();
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1292>";
					this.p_Parse("]");
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1293>";
					while((this.p_CParse("[]"))!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1294>";
						t_ty=(t_ty.p_ArrayOf());
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1296>";
					t_init=(c_NewArrayExpr.m_new.call(new c_NewArrayExpr,t_ty,t_len));
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1297>";
					t_ty=(t_ty.p_ArrayOf());
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1298>";
					if(t_toke!="const"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1299>";
						t_init=(c_ConstExpr.m_new.call(new c_ConstExpr,t_ty,""));
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1301>";
						bb_config_Err("Constants must be initialized.");
					}
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1305>";
	var t_decl=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1307>";
	var t_=t_toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1308>";
	if(t_=="global"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1308>";
		t_decl=(c_GlobalDecl.m_new.call(new c_GlobalDecl,t_id,t_attrs,t_ty,t_init));
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1309>";
		if(t_=="field"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1309>";
			t_decl=(c_FieldDecl.m_new.call(new c_FieldDecl,t_id,t_attrs,t_ty,t_init));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1310>";
			if(t_=="const"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1310>";
				t_decl=(c_ConstDecl.m_new.call(new c_ConstDecl,t_id,t_attrs,t_ty,t_init));
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1311>";
				if(t_=="local"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1311>";
					t_decl=(c_LocalDecl.m_new.call(new c_LocalDecl,t_id,t_attrs,t_ty,t_init));
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1314>";
	if(((t_decl.p_IsExtern())!=0) || ((this.p_CParse("extern"))!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1315>";
		dbg_object(t_decl).m_munged=dbg_object(t_decl).m_ident;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1316>";
		if((this.p_CParse("="))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1316>";
			dbg_object(t_decl).m_munged=this.p_ParseStringLit();
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1319>";
	var t_2=(t_decl);
	pop_err();
	return t_2;
}
c_Parser.prototype.p_ParseDecls=function(t_toke,t_attrs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1323>";
	if((t_toke).length!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1323>";
		this.p_Parse(t_toke);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1325>";
	var t_decls=c_List2.m_new.call(new c_List2);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1326>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1327>";
		var t_decl=this.p_ParseDecl(t_toke,t_attrs);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1328>";
		t_decls.p_AddLast2(t_decl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1329>";
		if(!((this.p_CParse(","))!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1329>";
			pop_err();
			return t_decls;
		}
	}while(!(false));
}
c_Parser.prototype.p_PushBlock=function(t_block){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<373>";
	this.m__blockStack.p_AddLast8(this.m__block);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<374>";
	this.m__errStack.p_AddLast(bb_config__errInfo);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<375>";
	this.m__block=t_block;
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseDeclStmts=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1334>";
	var t_toke=this.m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1335>";
	this.p_NextToke();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1336>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1337>";
		var t_decl=this.p_ParseDecl(t_toke,0);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1338>";
		this.m__block.p_AddStmt(c_DeclStmt.m_new.call(new c_DeclStmt,t_decl));
	}while(!(!((this.p_CParse(","))!=0)));
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseReturnStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1087>";
	this.p_Parse("return");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1088>";
	var t_expr=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1089>";
	if(!((this.p_AtEos())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1089>";
		t_expr=this.p_ParseExpr();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1090>";
	this.m__block.p_AddStmt(c_ReturnStmt.m_new.call(new c_ReturnStmt,t_expr));
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseExitStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1094>";
	this.p_Parse("exit");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1095>";
	this.m__block.p_AddStmt(c_BreakStmt.m_new.call(new c_BreakStmt));
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseContinueStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1099>";
	this.p_Parse("continue");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1100>";
	this.m__block.p_AddStmt(c_ContinueStmt.m_new.call(new c_ContinueStmt));
	pop_err();
	return 0;
}
c_Parser.prototype.p_PopBlock=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<379>";
	this.m__block=this.m__blockStack.p_RemoveLast();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<380>";
	bb_config__errInfo=this.m__errStack.p_RemoveLast();
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseIfStmt=function(t_term){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<898>";
	this.p_CParse("if");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<900>";
	var t_expr=this.p_ParseExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<902>";
	this.p_CParse("then");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<904>";
	var t_thenBlock=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<905>";
	var t_elseBlock=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<907>";
	var t_eatTerm=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<908>";
	if(!((t_term).length!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<909>";
		if(this.m__toke=="\n"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<909>";
			t_term="end";
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<909>";
			t_term="\n";
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<910>";
		t_eatTerm=1;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<913>";
	this.p_PushBlock(t_thenBlock);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<914>";
	while(this.m__toke!=t_term){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<915>";
		var t_=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<916>";
		if(t_=="endif"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<917>";
			if(t_term=="end"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<917>";
				break;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<918>";
			bb_config_Err("Syntax error - expecting 'End'.");
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<919>";
			if(t_=="else" || t_=="elseif"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<920>";
				var t_elif=((this.m__toke=="elseif")?1:0);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<921>";
				this.p_NextToke();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<922>";
				if(this.m__block==t_elseBlock){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<923>";
					bb_config_Err("If statement can only have one 'else' block.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<925>";
				this.p_PopBlock();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<926>";
				this.p_PushBlock(t_elseBlock);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<927>";
				if(((t_elif)!=0) || this.m__toke=="if"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<928>";
					this.p_ParseIfStmt(t_term);
				}
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<931>";
				this.p_ParseStmt();
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<934>";
	this.p_PopBlock();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<936>";
	if((t_eatTerm)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<937>";
		this.p_NextToke();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<938>";
		if(t_term=="end"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<938>";
			this.p_CParse("if");
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<941>";
	var t_stmt=c_IfStmt.m_new.call(new c_IfStmt,t_expr,t_thenBlock,t_elseBlock);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<943>";
	this.m__block.p_AddStmt(t_stmt);
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseWhileStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<948>";
	this.p_Parse("while");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<950>";
	var t_expr=this.p_ParseExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<951>";
	var t_block=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<953>";
	this.p_PushBlock(t_block);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<954>";
	while(!((this.p_CParse("wend"))!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<955>";
		if((this.p_CParse("end"))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<956>";
			this.p_CParse("while");
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<957>";
			break;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<959>";
		this.p_ParseStmt();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<961>";
	this.p_PopBlock();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<963>";
	var t_stmt=c_WhileStmt.m_new.call(new c_WhileStmt,t_expr,t_block);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<965>";
	this.m__block.p_AddStmt(t_stmt);
	pop_err();
	return 0;
}
c_Parser.prototype.p_PushErr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<365>";
	this.m__errStack.p_AddLast(bb_config__errInfo);
	pop_err();
	return 0;
}
c_Parser.prototype.p_PopErr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<369>";
	bb_config__errInfo=this.m__errStack.p_RemoveLast();
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseRepeatStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<970>";
	this.p_Parse("repeat");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<972>";
	var t_block=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<974>";
	this.p_PushBlock(t_block);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<975>";
	while(this.m__toke!="until" && this.m__toke!="forever"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<976>";
		this.p_ParseStmt();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<978>";
	this.p_PopBlock();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<980>";
	var t_expr=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<981>";
	if((this.p_CParse("until"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<982>";
		this.p_PushErr();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<983>";
		t_expr=this.p_ParseExpr();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<984>";
		this.p_PopErr();
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<986>";
		this.p_Parse("forever");
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<987>";
		t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_boolType),""));
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<990>";
	var t_stmt=c_RepeatStmt.m_new.call(new c_RepeatStmt,t_block,t_expr);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<992>";
	this.m__block.p_AddStmt(t_stmt);
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseForStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<997>";
	this.p_Parse("for");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<999>";
	var t_varid="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<999>";
	var t_varty=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<999>";
	var t_varlocal=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1001>";
	if((this.p_CParse("local"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1002>";
		t_varlocal=1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1003>";
		t_varid=this.p_ParseIdent();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1004>";
		if(!((this.p_CParse(":="))!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1005>";
			t_varty=this.p_ParseDeclType();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1006>";
			this.p_Parse("=");
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1009>";
		t_varlocal=0;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1010>";
		t_varid=this.p_ParseIdent();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1011>";
		this.p_Parse("=");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1014>";
	if((this.p_CParse("eachin"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1015>";
		var t_expr=this.p_ParseExpr();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1016>";
		var t_block=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1018>";
		this.p_PushBlock(t_block);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1019>";
		while(!((this.p_CParse("next"))!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1020>";
			if((this.p_CParse("end"))!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1021>";
				this.p_CParse("for");
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1022>";
				break;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1024>";
			this.p_ParseStmt();
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1026>";
		this.p_PopBlock();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1028>";
		var t_stmt=c_ForEachinStmt.m_new.call(new c_ForEachinStmt,t_varid,t_varty,t_varlocal,t_expr,t_block);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1030>";
		this.m__block.p_AddStmt(t_stmt);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1032>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1035>";
	var t_from=this.p_ParseExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1037>";
	var t_op="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1038>";
	if((this.p_CParse("to"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1039>";
		t_op="<=";
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1040>";
		if((this.p_CParse("until"))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1041>";
			t_op="<";
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1043>";
			bb_config_Err("Expecting 'To' or 'Until'.");
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1046>";
	var t_term=this.p_ParseExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1047>";
	var t_stp=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1049>";
	if((this.p_CParse("step"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1050>";
		t_stp=this.p_ParseExpr();
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1052>";
		t_stp=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_intType),"1"));
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1055>";
	var t_init=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1055>";
	var t_expr2=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1055>";
	var t_incr=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1057>";
	if((t_varlocal)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1058>";
		var t_indexVar=c_LocalDecl.m_new.call(new c_LocalDecl,t_varid,0,t_varty,t_from);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1059>";
		t_init=(c_DeclStmt.m_new.call(new c_DeclStmt,(t_indexVar)));
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1061>";
		t_init=(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_IdentExpr.m_new.call(new c_IdentExpr,t_varid,null)),t_from));
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1064>";
	t_expr2=(c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,t_op,(c_IdentExpr.m_new.call(new c_IdentExpr,t_varid,null)),t_term));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1065>";
	t_incr=(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_IdentExpr.m_new.call(new c_IdentExpr,t_varid,null)),(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,"+",(c_IdentExpr.m_new.call(new c_IdentExpr,t_varid,null)),t_stp))));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1067>";
	var t_block2=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1069>";
	this.p_PushBlock(t_block2);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1070>";
	while(!((this.p_CParse("next"))!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1071>";
		if((this.p_CParse("end"))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1072>";
			this.p_CParse("for");
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1073>";
			break;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1075>";
		this.p_ParseStmt();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1077>";
	this.p_PopBlock();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1079>";
	this.p_NextToke();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1081>";
	var t_stmt2=c_ForStmt.m_new.call(new c_ForStmt,t_init,t_expr2,t_incr,t_block2);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1083>";
	this.m__block.p_AddStmt(t_stmt2);
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseSelectStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1139>";
	this.p_Parse("select");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1141>";
	var t_expr=this.p_ParseExpr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1143>";
	var t_block=this.m__block;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1149>";
	var t_tmpVar=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,null,t_expr);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1150>";
	var t_tmpExpr=c_VarExpr.m_new.call(new c_VarExpr,(t_tmpVar));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1152>";
	t_block.p_AddStmt(c_DeclStmt.m_new.call(new c_DeclStmt,(t_tmpVar)));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1154>";
	while(this.m__toke!="end" && this.m__toke!="default"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1155>";
		this.p_SetErr();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1156>";
		var t_=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1157>";
		if(t_=="\n"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1158>";
			this.p_NextToke();
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1159>";
			if(t_=="case"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1160>";
				this.p_NextToke();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1161>";
				var t_comp=null;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1162>";
				do{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1167>";
					t_expr=(c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,"=",(t_tmpExpr),this.p_ParseExpr()));
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1169>";
					if((t_comp)!=null){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1170>";
						t_comp=(c_BinaryLogicExpr.m_new.call(new c_BinaryLogicExpr,"or",t_comp,t_expr));
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1172>";
						t_comp=t_expr;
					}
				}while(!(!((this.p_CParse(","))!=0)));
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1176>";
				var t_thenBlock=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1177>";
				var t_elseBlock=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1179>";
				var t_ifstmt=c_IfStmt.m_new.call(new c_IfStmt,t_comp,t_thenBlock,t_elseBlock);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1180>";
				t_block.p_AddStmt(t_ifstmt);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1181>";
				t_block=dbg_object(t_ifstmt).m_thenBlock;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1183>";
				this.p_PushBlock(t_block);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1184>";
				while(this.m__toke!="case" && this.m__toke!="default" && this.m__toke!="end"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1185>";
					this.p_ParseStmt();
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1187>";
				this.p_PopBlock();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1189>";
				t_block=t_elseBlock;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1191>";
				bb_config_Err("Syntax error - expecting 'Case', 'Default' or 'End'.");
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1195>";
	if(this.m__toke=="default"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1196>";
		this.p_NextToke();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1197>";
		this.p_PushBlock(t_block);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1198>";
		while(this.m__toke!="end"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1199>";
			this.p_SetErr();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1200>";
			var t_2=this.m__toke;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1201>";
			if(t_2=="case"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1202>";
				bb_config_Err("Case can not appear after default.");
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1203>";
				if(t_2=="default"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1204>";
					bb_config_Err("Select statement can have only one default block.");
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1206>";
			this.p_ParseStmt();
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1208>";
		this.p_PopBlock();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1211>";
	this.p_SetErr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1212>";
	this.p_Parse("end");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1213>";
	this.p_CParse("select");
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseTryStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1104>";
	this.p_Parse("try");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1106>";
	var t_block=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1107>";
	var t_catches=c_Stack6.m_new.call(new c_Stack6);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1109>";
	this.p_PushBlock(t_block);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1110>";
	while(this.m__toke!="end"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1111>";
		if((this.p_CParse("catch"))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1112>";
			var t_id=this.p_ParseIdent();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1113>";
			this.p_Parse(":");
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1114>";
			var t_ty=this.p_ParseType();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1115>";
			var t_init=c_LocalDecl.m_new.call(new c_LocalDecl,t_id,0,t_ty,null);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1116>";
			var t_block2=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1117>";
			t_catches.p_Push16(c_CatchStmt.m_new.call(new c_CatchStmt,t_init,t_block2));
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1118>";
			this.p_PopBlock();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1119>";
			this.p_PushBlock(t_block2);
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1121>";
			this.p_ParseStmt();
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1124>";
	if(!((t_catches.p_Length())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1124>";
		bb_config_Err("Try block must have at least one catch block");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1125>";
	this.p_PopBlock();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1126>";
	this.p_NextToke();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1127>";
	this.p_CParse("try");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1129>";
	this.m__block.p_AddStmt(c_TryStmt.m_new.call(new c_TryStmt,t_block,t_catches.p_ToArray()));
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseThrowStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1133>";
	this.p_Parse("throw");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1135>";
	this.m__block.p_AddStmt(c_ThrowStmt.m_new.call(new c_ThrowStmt,this.p_ParseExpr()));
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseStmt=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1217>";
	this.p_SetErr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1218>";
	var t_=this.m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1219>";
	if(t_==";" || t_=="\n"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1220>";
		this.p_NextToke();
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1221>";
		if(t_=="const" || t_=="local"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1222>";
			this.p_ParseDeclStmts();
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1223>";
			if(t_=="return"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1224>";
				this.p_ParseReturnStmt();
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1225>";
				if(t_=="exit"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1226>";
					this.p_ParseExitStmt();
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1227>";
					if(t_=="continue"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1228>";
						this.p_ParseContinueStmt();
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1229>";
						if(t_=="if"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1230>";
							this.p_ParseIfStmt("");
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1231>";
							if(t_=="while"){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1232>";
								this.p_ParseWhileStmt();
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1233>";
								if(t_=="repeat"){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1234>";
									this.p_ParseRepeatStmt();
								}else{
									err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1235>";
									if(t_=="for"){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1236>";
										this.p_ParseForStmt();
									}else{
										err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1237>";
										if(t_=="select"){
											err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1238>";
											this.p_ParseSelectStmt();
										}else{
											err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1239>";
											if(t_=="try"){
												err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1240>";
												this.p_ParseTryStmt();
											}else{
												err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1241>";
												if(t_=="throw"){
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1242>";
													this.p_ParseThrowStmt();
												}else{
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1244>";
													var t_expr=this.p_ParsePrimaryExpr(1);
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1246>";
													var t_2=this.m__toke;
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1247>";
													if(t_2=="=" || t_2=="*=" || t_2=="/=" || t_2=="+=" || t_2=="-=" || t_2=="&=" || t_2=="|=" || t_2=="~=" || t_2=="mod" || t_2=="shl" || t_2=="shr"){
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1248>";
														if(((object_downcast((t_expr),c_IdentExpr))!=null) || ((object_downcast((t_expr),c_IndexExpr))!=null)){
															err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1249>";
															var t_op=this.m__toke;
															err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1250>";
															this.p_NextToke();
															err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1251>";
															if(!string_endswith(t_op,"=")){
																err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1252>";
																this.p_Parse("=");
																err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1253>";
																t_op=t_op+"=";
															}
															err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1255>";
															this.m__block.p_AddStmt(c_AssignStmt.m_new.call(new c_AssignStmt,t_op,t_expr,this.p_ParseExpr()));
														}else{
															err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1257>";
															bb_config_Err("Assignment operator '"+this.m__toke+"' cannot be used this way.");
														}
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1259>";
														pop_err();
														return 0;
													}
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1262>";
													if((object_downcast((t_expr),c_IdentExpr))!=null){
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1264>";
														t_expr=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,t_expr,this.p_ParseArgs(1)));
													}else{
														err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1266>";
														if(((object_downcast((t_expr),c_FuncCallExpr))!=null) || ((object_downcast((t_expr),c_InvokeSuperExpr))!=null) || ((object_downcast((t_expr),c_NewObjectExpr))!=null)){
														}else{
															err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1269>";
															bb_config_Err("Expression cannot be used as a statement.");
														}
													}
													err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1272>";
													this.m__block.p_AddStmt(c_ExprStmt.m_new.call(new c_ExprStmt,t_expr));
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	pop_err();
	return 0;
}
c_Parser.prototype.p_ParseFuncDecl=function(t_attrs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1344>";
	this.p_SetErr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1346>";
	if((this.p_CParse("method"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1347>";
		t_attrs|=1;
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1348>";
		if(!((this.p_CParse("function"))!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1349>";
			bb_config_InternalErr("Internal error");
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1352>";
	t_attrs|=this.m__defattrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1354>";
	var t_id="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1355>";
	var t_ty=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1357>";
	if((t_attrs&1)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1358>";
		if(this.m__toke=="new"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1359>";
			if((t_attrs&256)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1359>";
				bb_config_Err("Extern classes cannot have constructors.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1360>";
			t_id=this.m__toke;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1361>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1362>";
			t_attrs|=2;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1363>";
			t_attrs&=-2;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1365>";
			t_id=this.p_ParseIdent();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1366>";
			t_ty=this.p_ParseDeclType();
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1369>";
		t_id=this.p_ParseIdent();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1370>";
		t_ty=this.p_ParseDeclType();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1373>";
	var t_args=c_Stack5.m_new.call(new c_Stack5);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1375>";
	this.p_Parse("(");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1376>";
	this.p_SkipEols();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1377>";
	if(this.m__toke!=")"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1378>";
		do{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1379>";
			var t_id2=this.p_ParseIdent();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1380>";
			var t_ty2=this.p_ParseDeclType();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1381>";
			var t_init=null;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1382>";
			if((this.p_CParse("="))!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1382>";
				t_init=this.p_ParseExpr();
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1383>";
			t_args.p_Push13(c_ArgDecl.m_new.call(new c_ArgDecl,t_id2,0,t_ty2,t_init));
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1384>";
			if(this.m__toke==")"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1384>";
				break;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1385>";
			this.p_Parse(",");
		}while(!(false));
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1388>";
	this.p_Parse(")");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1390>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1391>";
		if((this.p_CParse("final"))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1392>";
			if(!((t_attrs&1)!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1392>";
				bb_config_Err("Functions cannot be final.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1393>";
			if((t_attrs&2048)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1393>";
				bb_config_Err("Duplicate method attribute.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1394>";
			if((t_attrs&1024)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1394>";
				bb_config_Err("Methods cannot be both final and abstract.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1395>";
			t_attrs|=2048;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1396>";
			if((this.p_CParse("abstract"))!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1397>";
				if(!((t_attrs&1)!=0)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1397>";
					bb_config_Err("Functions cannot be abstract.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1398>";
				if((t_attrs&1024)!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1398>";
					bb_config_Err("Duplicate method attribute.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1399>";
				if((t_attrs&2048)!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1399>";
					bb_config_Err("Methods cannot be both final and abstract.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1400>";
				t_attrs|=1024;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1401>";
				if((this.p_CParse("property"))!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1402>";
					if(!((t_attrs&1)!=0)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1402>";
						bb_config_Err("Functions cannot be properties.");
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1403>";
					if((t_attrs&4)!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1403>";
						bb_config_Err("Duplicate method attribute.");
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1404>";
					t_attrs|=4;
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1406>";
					break;
				}
			}
		}
	}while(!(false));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1410>";
	var t_funcDecl=c_FuncDecl.m_new.call(new c_FuncDecl,t_id,t_attrs,t_ty,t_args.p_ToArray());
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1412>";
	if(((t_funcDecl.p_IsExtern())!=0) || ((this.p_CParse("extern"))!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1413>";
		dbg_object(t_funcDecl).m_munged=dbg_object(t_funcDecl).m_ident;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1414>";
		if((this.p_CParse("="))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1415>";
			dbg_object(t_funcDecl).m_munged=this.p_ParseStringLit();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1417>";
			if(dbg_object(t_funcDecl).m_munged=="$resize"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1417>";
				dbg_object(t_funcDecl).m_retType=(c_Type.m_emptyArrayType);
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1421>";
	if(((t_funcDecl.p_IsExtern())!=0) || ((t_funcDecl.p_IsAbstract())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1421>";
		pop_err();
		return t_funcDecl;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1423>";
	this.p_PushBlock(t_funcDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1424>";
	while(this.m__toke!="end"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1425>";
		this.p_ParseStmt();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1427>";
	this.p_PopBlock();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1429>";
	this.p_NextToke();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1431>";
	if((t_attrs&3)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1432>";
		this.p_CParse("method");
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1434>";
		this.p_CParse("function");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1437>";
	pop_err();
	return t_funcDecl;
}
c_Parser.prototype.p_ParseClassDecl=function(t_attrs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1442>";
	this.p_SetErr();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1443>";
	var t_toke=this.m__toke;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1445>";
	if((this.p_CParse("interface"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1446>";
		if((t_attrs&256)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1446>";
			bb_config_Err("Interfaces cannot be extern.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1447>";
		t_attrs|=5120;
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1448>";
		if(!((this.p_CParse("class"))!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1449>";
			bb_config_InternalErr("Internal error");
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1452>";
	var t_id=this.p_ParseIdent();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1453>";
	var t_args=c_StringStack.m_new2.call(new c_StringStack);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1454>";
	var t_superTy=c_Type.m_objectType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1455>";
	var t_imps=c_Stack4.m_new.call(new c_Stack4);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1457>";
	if((this.p_CParse("<"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1458>";
		if((t_attrs&256)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1458>";
			bb_config_Err("Extern classes cannot be generic.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1459>";
		if((t_attrs&4096)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1459>";
			bb_config_Err("Interfaces cannot be generic.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1460>";
		do{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1461>";
			t_args.p_Push(this.p_ParseIdent());
		}while(!(!((this.p_CParse(","))!=0)));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1463>";
		this.p_Parse(">");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1466>";
	if((this.p_CParse("extends"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1467>";
		if((this.p_CParse("null"))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1468>";
			if((t_attrs&4096)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1468>";
				bb_config_Err("Interfaces cannot extend null");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1469>";
			if(!((t_attrs&256)!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1469>";
				bb_config_Err("Only extern objects can extend null.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1470>";
			t_superTy=null;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1471>";
			if((t_attrs&4096)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1472>";
				do{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1473>";
					t_imps.p_Push10(this.p_ParseIdentType());
				}while(!(!((this.p_CParse(","))!=0)));
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1475>";
				t_superTy=c_Type.m_objectType;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1477>";
				t_superTy=this.p_ParseIdentType();
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1481>";
	if((this.p_CParse("implements"))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1482>";
		if((t_attrs&256)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1482>";
			bb_config_Err("Implements cannot be used with external classes.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1483>";
		if((t_attrs&4096)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1483>";
			bb_config_Err("Implements cannot be used with interfaces.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1484>";
		do{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1485>";
			t_imps.p_Push10(this.p_ParseIdentType());
		}while(!(!((this.p_CParse(","))!=0)));
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1489>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1490>";
		if((this.p_CParse("final"))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1491>";
			if((t_attrs&4096)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1491>";
				bb_config_Err("Interfaces cannot be final.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1492>";
			if((t_attrs&2048)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1492>";
				bb_config_Err("Duplicate class attribute.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1493>";
			if((t_attrs&1024)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1493>";
				bb_config_Err("Classes cannot be both final and abstract.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1494>";
			t_attrs|=2048;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1495>";
			if((this.p_CParse("abstract"))!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1496>";
				if((t_attrs&4096)!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1496>";
					bb_config_Err("Interfaces cannot be abstract.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1497>";
				if((t_attrs&1024)!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1497>";
					bb_config_Err("Duplicate class attribute.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1498>";
				if((t_attrs&2048)!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1498>";
					bb_config_Err("Classes cannot be both final and abstract.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1499>";
				t_attrs|=1024;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1501>";
				break;
			}
		}
	}while(!(false));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1505>";
	var t_classDecl=c_ClassDecl.m_new.call(new c_ClassDecl,t_id,t_attrs,t_args.p_ToArray(),t_superTy,t_imps.p_ToArray());
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1507>";
	if(((t_classDecl.p_IsExtern())!=0) || ((this.p_CParse("extern"))!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1508>";
		dbg_object(t_classDecl).m_munged=dbg_object(t_classDecl).m_ident;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1509>";
		if((this.p_CParse("="))!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1509>";
			dbg_object(t_classDecl).m_munged=this.p_ParseStringLit();
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1512>";
	var t_decl_attrs=t_attrs&256;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1514>";
	var t_func_attrs=t_decl_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1515>";
	if((t_attrs&4096)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1515>";
		t_func_attrs|=1024;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1520>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1521>";
		this.p_SkipEols();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1522>";
		var t_=this.m__toke;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1523>";
		if(t_=="end"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1524>";
			this.p_NextToke();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1525>";
			break;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1526>";
			if(t_=="private"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1527>";
				this.p_NextToke();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1528>";
				t_decl_attrs=t_decl_attrs|512;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1529>";
				if(t_=="public"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1530>";
					this.p_NextToke();
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1531>";
					t_decl_attrs=t_decl_attrs&-513;
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1532>";
					if(t_=="const" || t_=="global" || t_=="field"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1533>";
						if(((t_attrs&4096)!=0) && this.m__toke!="const"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1533>";
							bb_config_Err("Interfaces can only contain constants and methods.");
						}
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1534>";
						t_classDecl.p_InsertDecls(this.p_ParseDecls(this.m__toke,t_decl_attrs));
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1535>";
						if(t_=="method"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1536>";
							t_classDecl.p_InsertDecl(this.p_ParseFuncDecl(t_func_attrs));
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1537>";
							if(t_=="function"){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1538>";
								if((t_attrs&4096)!=0){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1538>";
									bb_config_Err("Interfaces can only contain constants and methods.");
								}
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1539>";
								t_classDecl.p_InsertDecl(this.p_ParseFuncDecl(t_func_attrs));
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1541>";
								bb_config_Err("Syntax error - expecting class member declaration.");
							}
						}
					}
				}
			}
		}
	}while(!(false));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1545>";
	if((t_toke).length!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1545>";
		this.p_CParse(t_toke);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1547>";
	pop_err();
	return t_classDecl;
}
c_Parser.prototype.p_ParseMain=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1650>";
	this.p_SkipEols();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1651>";
	print("hier");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1652>";
	pop_err();
	return 0;
}
function bb_config_IsSpace(t_ch){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<75>";
	var t_=((t_ch<=32)?1:0);
	pop_err();
	return t_;
}
function bb_config_IsAlpha(t_ch){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<85>";
	var t_=((t_ch>=65 && t_ch<=90 || t_ch>=97 && t_ch<=122)?1:0);
	pop_err();
	return t_;
}
function bb_config_IsDigit(t_ch){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<80>";
	var t_=((t_ch>=48 && t_ch<=57)?1:0);
	pop_err();
	return t_;
}
function bb_config_IsBinDigit(t_ch){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<90>";
	var t_=((t_ch==48 || t_ch==49)?1:0);
	pop_err();
	return t_;
}
function bb_config_IsHexDigit(t_ch){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<95>";
	var t_=((t_ch>=48 && t_ch<=57 || t_ch>=65 && t_ch<=70 || t_ch>=97 && t_ch<=102)?1:0);
	pop_err();
	return t_;
}
function bb_os_StripExt(t_path){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<142>";
	var t_i=t_path.lastIndexOf(".");
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<143>";
	if(t_i!=-1 && t_path.indexOf("/",t_i+1)==-1 && t_path.indexOf("\\",t_i+1)==-1){
		err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<143>";
		var t_=t_path.slice(0,t_i);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<144>";
	pop_err();
	return t_path;
}
function bb_os_StripDir(t_path){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<129>";
	var t_i=t_path.lastIndexOf("/");
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<130>";
	if(t_i==-1){
		err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<130>";
		t_i=t_path.lastIndexOf("\\");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<131>";
	if(t_i!=-1){
		err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<131>";
		var t_=t_path.slice(t_i+1);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<132>";
	pop_err();
	return t_path;
}
function bb_os_StripAll(t_path){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<154>";
	var t_=bb_os_StripDir(bb_os_StripExt(t_path));
	pop_err();
	return t_;
}
function bb_config_Err(t_err){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<65>";
	print(bb_config__errInfo+" : Error : "+t_err);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<66>";
	ExitApp(-1);
	pop_err();
	return 0;
}
function c_Map3(){
	Object.call(this);
	this.m_root=null;
}
c_Map3.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
c_Map3.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map3.prototype.p_RotateLeft3=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).m_right;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<252>";
	dbg_object(t_node).m_right=dbg_object(t_child).m_left;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).m_left)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).m_left).m_parent=t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<256>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}
	}else{
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<264>";
		this.m_root=t_child;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<266>";
	dbg_object(t_child).m_left=t_node;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<267>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map3.prototype.p_RotateRight3=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).m_left;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<272>";
	dbg_object(t_node).m_left=dbg_object(t_child).m_right;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).m_right)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).m_right).m_parent=t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<276>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}
	}else{
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<284>";
		this.m_root=t_child;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<286>";
	dbg_object(t_child).m_right=t_node;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<287>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map3.prototype.p_InsertFixup3=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).m_parent)!=null) && dbg_object(dbg_object(t_node).m_parent).m_color==-1 && ((dbg_object(dbg_object(t_node).m_parent).m_parent)!=null)){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).m_parent==dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_right;
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).m_color==-1){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).m_parent;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<223>";
					this.p_RotateLeft3(t_node);
				}
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<227>";
				this.p_RotateRight3(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left;
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).m_color==-1){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).m_parent;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<239>";
					this.p_RotateRight3(t_node);
				}
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<243>";
				this.p_RotateLeft3(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<247>";
	dbg_object(this.m_root).m_color=1;
	pop_err();
	return 0;
}
c_Map3.prototype.p_Set3=function(t_key,t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<29>";
	var t_node=this.m_root;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<34>";
		t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<40>";
				dbg_object(t_node).m_value=t_value;
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<45>";
	t_node=c_Node4.m_new.call(new c_Node4,t_key,t_value,-1,t_parent);
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).m_right=t_node;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).m_left=t_node;
		}
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<53>";
		this.p_InsertFixup3(t_node);
	}else{
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<55>";
		this.m_root=t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
c_Map3.prototype.p_Insert3=function(t_key,t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<126>";
	var t_=this.p_Set3(t_key,t_value);
	pop_err();
	return t_;
}
c_Map3.prototype.p_FindNode=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<157>";
	var t_node=this.m_root;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<160>";
		var t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
c_Map3.prototype.p_Contains=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<25>";
	var t_=this.p_FindNode(t_key)!=null;
	pop_err();
	return t_;
}
c_Map3.prototype.p_Get=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<101>";
	var t_node=this.p_FindNode(t_key);
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).m_value;
	}
	pop_err();
	return null;
}
c_Map3.prototype.p_ValueForKey=function(t_key){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<131>";
	var t_=this.p_Get(t_key);
	pop_err();
	return t_;
}
c_Map3.prototype.p_Values=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<117>";
	var t_=c_MapValues.m_new.call(new c_MapValues,this);
	pop_err();
	return t_;
}
c_Map3.prototype.p_FirstNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<137>";
	if(!((this.m_root)!=null)){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<137>";
		pop_err();
		return null;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<139>";
	var t_node=this.m_root;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<140>";
	while((dbg_object(t_node).m_left)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<141>";
		t_node=dbg_object(t_node).m_left;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<143>";
	pop_err();
	return t_node;
}
function c_StringMap3(){
	c_Map3.call(this);
}
c_StringMap3.prototype=extend_class(c_Map3);
c_StringMap3.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<551>";
	c_Map3.m_new.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
c_StringMap3.prototype.p_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
function c_Node4(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node4.m_new=function(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<364>";
	dbg_object(this).m_key=t_key;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<365>";
	dbg_object(this).m_value=t_value;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<366>";
	dbg_object(this).m_color=t_color;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<367>";
	dbg_object(this).m_parent=t_parent;
	pop_err();
	return this;
}
c_Node4.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
c_Node4.prototype.p_NextNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<385>";
	var t_node=null;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<386>";
	if((this.m_right)!=null){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<387>";
		t_node=this.m_right;
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<388>";
		while((dbg_object(t_node).m_left)!=null){
			err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<389>";
			t_node=dbg_object(t_node).m_left;
		}
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<391>";
		pop_err();
		return t_node;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<393>";
	t_node=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<394>";
	var t_parent=dbg_object(this).m_parent;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<395>";
	while(((t_parent)!=null) && t_node==dbg_object(t_parent).m_right){
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<396>";
		t_node=t_parent;
		err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<397>";
		t_parent=dbg_object(t_parent).m_parent;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<399>";
	pop_err();
	return t_parent;
}
function bb_os_ExtractDir(t_path){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<136>";
	var t_i=t_path.lastIndexOf("/");
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<137>";
	if(t_i==-1){
		err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<137>";
		t_i=t_path.lastIndexOf("\\");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<138>";
	if(t_i!=-1){
		err_info="/Users/tluyben/Monkey-Interpeter/os/os.monkey<138>";
		var t_=t_path.slice(0,t_i);
		pop_err();
		return t_;
	}
	pop_err();
	return "";
}
function bb_config_GetCfgVar(t_key){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<22>";
	var t_=bb_config__cfgVars.p_Get(t_key);
	pop_err();
	return t_;
}
var bb_parser_FILE_EXT="";
function c_Stack(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_Stack.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<13>";
	dbg_object(this).m_data=t_data.slice(0);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<14>";
	dbg_object(this).m_length=t_data.length;
	pop_err();
	return this;
}
c_Stack.prototype.p_Push=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<55>";
	if(this.m_length==this.m_data.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<56>";
		this.m_data=resize_string_array(this.m_data,this.m_length*2+10);
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<58>";
	dbg_array(this.m_data,this.m_length)[dbg_index]=t_value
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<59>";
	this.m_length+=1;
	pop_err();
	return 0;
}
c_Stack.prototype.p_Push2=function(t_values,t_offset,t_count){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<69>";
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<70>";
		this.p_Push(dbg_array(t_values,t_offset+t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack.prototype.p_Push3=function(t_values,t_offset){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<63>";
	for(var t_i=t_offset;t_i<t_values.length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<64>";
		this.p_Push(dbg_array(t_values,t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack.prototype.p_ToArray=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<18>";
	var t_t=new_string_array(this.m_length);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<19>";
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<20>";
		dbg_array(t_t,t_i)[dbg_index]=dbg_array(this.m_data,t_i)[dbg_index]
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<22>";
	pop_err();
	return t_t;
}
function c_StringStack(){
	c_Stack.call(this);
}
c_StringStack.prototype=extend_class(c_Stack);
c_StringStack.m_new=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<254>";
	c_Stack.m_new2.call(this,t_data);
	pop_err();
	return this;
}
c_StringStack.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<251>";
	c_Stack.m_new.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<251>";
	pop_err();
	return this;
}
c_StringStack.prototype.p_Join=function(t_separator){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<258>";
	var t_=this.p_ToArray().join(t_separator);
	pop_err();
	return t_;
}
function c_Type(){
	Object.call(this);
	this.m_arrayOf=null;
}
c_Type.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<9>";
	pop_err();
	return this;
}
c_Type.m_boolType=null;
c_Type.m_stringType=null;
c_Type.m_voidType=null;
c_Type.m_emptyArrayType=null;
c_Type.m_intType=null;
c_Type.m_floatType=null;
c_Type.m_objectType=null;
c_Type.m_throwableType=null;
c_Type.prototype.p_ArrayOf=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<32>";
	if(!((this.m_arrayOf)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<32>";
		this.m_arrayOf=c_ArrayType.m_new.call(new c_ArrayType,this);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<33>";
	pop_err();
	return this.m_arrayOf;
}
c_Type.m_nullObjectType=null;
c_Type.prototype.p_EqualsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<12>";
	pop_err();
	return 0;
}
c_Type.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<20>";
	pop_err();
	return this;
}
c_Type.prototype.p_ExtendsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<16>";
	var t_=this.p_EqualsType(t_ty);
	pop_err();
	return t_;
}
c_Type.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<28>";
	pop_err();
	return "??Type??";
}
c_Type.prototype.p_GetClass=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<24>";
	pop_err();
	return null;
}
function c_BoolType(){
	c_Type.call(this);
}
c_BoolType.prototype=extend_class(c_Type);
c_BoolType.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<64>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<64>";
	pop_err();
	return this;
}
c_BoolType.prototype.p_EqualsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<67>";
	var t_=((object_downcast((t_ty),c_BoolType)!=null)?1:0);
	pop_err();
	return t_;
}
c_BoolType.prototype.p_ExtendsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<71>";
	if((object_downcast((t_ty),c_ObjectType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<72>";
		var t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(this),"")).p_Semant();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<73>";
		var t_ctor=t_ty.p_GetClass().p_FindFuncDecl("new",[t_expr],1);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<74>";
		var t_=((((t_ctor)!=null) && t_ctor.p_IsCtor())?1:0);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<76>";
	var t_2=((object_downcast((t_ty),c_IntType)!=null || object_downcast((t_ty),c_BoolType)!=null)?1:0);
	pop_err();
	return t_2;
}
c_BoolType.prototype.p_GetClass=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<80>";
	var t_=object_downcast((bb_decl__env.p_FindDecl("bool")),c_ClassDecl);
	pop_err();
	return t_;
}
c_BoolType.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<84>";
	pop_err();
	return "Bool";
}
function c_NodeEnumerator(){
	Object.call(this);
	this.m_node=null;
}
c_NodeEnumerator.m_new=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<437>";
	dbg_object(this).m_node=t_node;
	pop_err();
	return this;
}
c_NodeEnumerator.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<434>";
	pop_err();
	return this;
}
c_NodeEnumerator.prototype.p_HasNext=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<441>";
	var t_=this.m_node!=null;
	pop_err();
	return t_;
}
c_NodeEnumerator.prototype.p_NextObject=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<445>";
	var t_t=this.m_node;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<446>";
	this.m_node=this.m_node.p_NextNode();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<447>";
	pop_err();
	return t_t;
}
function c_ValDecl(){
	c_Decl.call(this);
	this.m_type=null;
	this.m_init=null;
}
c_ValDecl.prototype=extend_class(c_Decl);
c_ValDecl.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<181>";
	c_Decl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<181>";
	pop_err();
	return this;
}
c_ValDecl.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<187>";
	var t_t=c_Decl.prototype.p_ToString.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<188>";
	var t_=t_t+":"+this.m_type.p_ToString();
	pop_err();
	return t_;
}
c_ValDecl.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<196>";
	if((this.m_type)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<197>";
		this.m_type=this.m_type.p_Semant();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<198>";
		if((this.m_init)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<198>";
			this.m_init=this.m_init.p_Semant2(this.m_type,0);
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<199>";
		if((this.m_init)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<200>";
			this.m_init=this.m_init.p_Semant();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<201>";
			this.m_type=dbg_object(this.m_init).m_exprType;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<203>";
			bb_config_InternalErr("Internal error");
		}
	}
	pop_err();
	return 0;
}
c_ValDecl.prototype.p_CopyInit=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<192>";
	if((this.m_init)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<192>";
		var t_=this.m_init.p_Copy();
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function c_ConstDecl(){
	c_ValDecl.call(this);
	this.m_value="";
}
c_ConstDecl.prototype=extend_class(c_ValDecl);
c_ConstDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<212>";
	c_ValDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<213>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<214>";
	dbg_object(this).m_munged=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<215>";
	dbg_object(this).m_attrs=t_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<216>";
	dbg_object(this).m_type=t_type;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<217>";
	dbg_object(this).m_init=t_init;
	pop_err();
	return this;
}
c_ConstDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<209>";
	c_ValDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<209>";
	pop_err();
	return this;
}
c_ConstDecl.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<225>";
	c_ValDecl.prototype.p_OnSemant.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<226>";
	if(!((this.p_IsExtern())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<226>";
		this.m_value=this.m_init.p_Eval();
	}
	pop_err();
	return 0;
}
c_ConstDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<221>";
	var t_=(c_ConstDecl.m_new.call(new c_ConstDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
	pop_err();
	return t_;
}
function c_StringType(){
	c_Type.call(this);
}
c_StringType.prototype=extend_class(c_Type);
c_StringType.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<142>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<142>";
	pop_err();
	return this;
}
c_StringType.prototype.p_EqualsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<145>";
	var t_=((object_downcast((t_ty),c_StringType)!=null)?1:0);
	pop_err();
	return t_;
}
c_StringType.prototype.p_ExtendsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<149>";
	if((object_downcast((t_ty),c_ObjectType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<150>";
		var t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(this),"")).p_Semant();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<151>";
		var t_ctor=t_ty.p_GetClass().p_FindFuncDecl("new",[t_expr],1);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<152>";
		var t_=((((t_ctor)!=null) && t_ctor.p_IsCtor())?1:0);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<154>";
	var t_2=this.p_EqualsType(t_ty);
	pop_err();
	return t_2;
}
c_StringType.prototype.p_GetClass=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<158>";
	var t_=object_downcast((bb_decl__env.p_FindDecl("string")),c_ClassDecl);
	pop_err();
	return t_;
}
c_StringType.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<162>";
	pop_err();
	return "String";
}
function c_Expr(){
	Object.call(this);
	this.m_exprType=null;
}
c_Expr.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<9>";
	pop_err();
	return this;
}
c_Expr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<21>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return null;
}
c_Expr.prototype.p_SemantArgs=function(t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<74>";
	t_args=t_args.slice(0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<75>";
	for(var t_i=0;t_i<t_args.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<76>";
		if((dbg_array(t_args,t_i)[dbg_index])!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<76>";
			dbg_array(t_args,t_i)[dbg_index]=dbg_array(t_args,t_i)[dbg_index].p_Semant()
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<78>";
	pop_err();
	return t_args;
}
c_Expr.prototype.p_Cast=function(t_ty,t_castFlags){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<69>";
	if((this.m_exprType.p_EqualsType(t_ty))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<69>";
		pop_err();
		return this;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<70>";
	var t_=(c_CastExpr.m_new.call(new c_CastExpr,t_ty,this,t_castFlags)).p_Semant();
	pop_err();
	return t_;
}
c_Expr.prototype.p_CastArgs=function(t_args,t_funcDecl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<82>";
	if(t_args.length>dbg_object(t_funcDecl).m_argDecls.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<82>";
		bb_config_InternalErr("Internal error");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<84>";
	t_args=resize_object_array(t_args,dbg_object(t_funcDecl).m_argDecls.length);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<86>";
	for(var t_i=0;t_i<t_args.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<87>";
		if((dbg_array(t_args,t_i)[dbg_index])!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<88>";
			dbg_array(t_args,t_i)[dbg_index]=dbg_array(t_args,t_i)[dbg_index].p_Cast(dbg_object(dbg_array(dbg_object(t_funcDecl).m_argDecls,t_i)[dbg_index]).m_type,0)
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<89>";
			if((dbg_object(dbg_array(dbg_object(t_funcDecl).m_argDecls,t_i)[dbg_index]).m_init)!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<90>";
				dbg_array(t_args,t_i)[dbg_index]=dbg_object(dbg_array(dbg_object(t_funcDecl).m_argDecls,t_i)[dbg_index]).m_init
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<92>";
				bb_config_Err("Missing function argument '"+dbg_object(dbg_array(dbg_object(t_funcDecl).m_argDecls,t_i)[dbg_index]).m_ident+"'.");
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<95>";
	pop_err();
	return t_args;
}
c_Expr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<13>";
	pop_err();
	return "<Expr>";
}
c_Expr.prototype.p_Eval=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<37>";
	bb_config_Err(this.p_ToString()+" cannot be statically evaluated.");
	pop_err();
	return "";
}
c_Expr.prototype.p_EvalConst=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<41>";
	var t_=(c_ConstExpr.m_new.call(new c_ConstExpr,this.m_exprType,this.p_Eval())).p_Semant();
	pop_err();
	return t_;
}
c_Expr.prototype.p_Semant2=function(t_ty,t_castFlags){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<62>";
	var t_expr=this.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<63>";
	if((dbg_object(t_expr).m_exprType.p_EqualsType(t_ty))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<63>";
		pop_err();
		return t_expr;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<64>";
	var t_=(c_CastExpr.m_new.call(new c_CastExpr,t_ty,t_expr,t_castFlags)).p_Semant();
	pop_err();
	return t_;
}
c_Expr.prototype.p_BalanceTypes=function(t_lhs,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<99>";
	if(((object_downcast((t_lhs),c_StringType))!=null) || ((object_downcast((t_rhs),c_StringType))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<99>";
		var t_=(c_Type.m_stringType);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<100>";
	if(((object_downcast((t_lhs),c_FloatType))!=null) || ((object_downcast((t_rhs),c_FloatType))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<100>";
		var t_2=(c_Type.m_floatType);
		pop_err();
		return t_2;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<101>";
	if(((object_downcast((t_lhs),c_IntType))!=null) || ((object_downcast((t_rhs),c_IntType))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<101>";
		var t_3=(c_Type.m_intType);
		pop_err();
		return t_3;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<102>";
	if((t_lhs.p_ExtendsType(t_rhs))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<102>";
		pop_err();
		return t_rhs;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<103>";
	if((t_rhs.p_ExtendsType(t_lhs))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<103>";
		pop_err();
		return t_lhs;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<104>";
	bb_config_Err("Can't balance types "+t_lhs.p_ToString()+" and "+t_rhs.p_ToString()+".");
	pop_err();
	return null;
}
c_Expr.prototype.p_SemantSet=function(t_op,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<25>";
	bb_config_Err(this.p_ToString()+" cannot be assigned to.");
	pop_err();
	return null;
}
c_Expr.prototype.p_SemantScope=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<33>";
	pop_err();
	return null;
}
c_Expr.prototype.p_SemantFunc=function(t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<29>";
	bb_config_Err(this.p_ToString()+" cannot be invoked.");
	pop_err();
	return null;
}
c_Expr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<17>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return null;
}
c_Expr.prototype.p_SideEffects=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<45>";
	pop_err();
	return true;
}
c_Expr.prototype.p_CopyExpr=function(t_expr){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<108>";
	if(!((t_expr)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<108>";
		pop_err();
		return null;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<109>";
	var t_=t_expr.p_Copy();
	pop_err();
	return t_;
}
c_Expr.prototype.p_CopyArgs=function(t_exprs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<113>";
	t_exprs=t_exprs.slice(0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<114>";
	for(var t_i=0;t_i<t_exprs.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<115>";
		dbg_array(t_exprs,t_i)[dbg_index]=this.p_CopyExpr(dbg_array(t_exprs,t_i)[dbg_index])
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<117>";
	pop_err();
	return t_exprs;
}
function c_ConstExpr(){
	c_Expr.call(this);
	this.m_ty=null;
	this.m_value="";
}
c_ConstExpr.prototype=extend_class(c_Expr);
c_ConstExpr.m_new=function(t_ty,t_value){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<160>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<161>";
	if((object_downcast((t_ty),c_IntType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<162>";
		if(string_startswith(t_value,"%")){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<163>";
			t_value=String(bb_config_StringToInt(t_value.slice(1),2));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<164>";
			if(string_startswith(t_value,"$")){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<165>";
				t_value=String(bb_config_StringToInt(t_value.slice(1),16));
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<168>";
				while(string_startswith(t_value,"0")){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<169>";
					t_value=t_value.slice(1);
				}
			}
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<172>";
		if((object_downcast((t_ty),c_FloatType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<173>";
			if(!((t_value.indexOf("e")!=-1) || (t_value.indexOf("E")!=-1) || (t_value.indexOf(".")!=-1))){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<174>";
				t_value=t_value+".0";
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<177>";
	dbg_object(this).m_ty=t_ty;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<178>";
	dbg_object(this).m_value=t_value;
	pop_err();
	return this;
}
c_ConstExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<156>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<156>";
	pop_err();
	return this;
}
c_ConstExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<194>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<194>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<196>";
	this.m_exprType=this.m_ty.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<197>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_ConstExpr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<186>";
	var t_="ConstExpr(\""+this.m_value+"\")";
	pop_err();
	return t_;
}
c_ConstExpr.prototype.p_Eval=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<201>";
	pop_err();
	return this.m_value;
}
c_ConstExpr.prototype.p_EvalConst=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<205>";
	var t_=(this);
	pop_err();
	return t_;
}
c_ConstExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<182>";
	var t_=(c_ConstExpr.m_new.call(new c_ConstExpr,this.m_ty,this.m_value));
	pop_err();
	return t_;
}
c_ConstExpr.prototype.p_SideEffects=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<190>";
	pop_err();
	return false;
}
function c_NumericType(){
	c_Type.call(this);
}
c_NumericType.prototype=extend_class(c_Type);
c_NumericType.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<89>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<89>";
	pop_err();
	return this;
}
function c_IntType(){
	c_NumericType.call(this);
}
c_IntType.prototype=extend_class(c_NumericType);
c_IntType.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<93>";
	c_NumericType.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<93>";
	pop_err();
	return this;
}
c_IntType.prototype.p_EqualsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<96>";
	var t_=((object_downcast((t_ty),c_IntType)!=null)?1:0);
	pop_err();
	return t_;
}
c_IntType.prototype.p_ExtendsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<100>";
	if((object_downcast((t_ty),c_ObjectType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<101>";
		var t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(this),"")).p_Semant();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<102>";
		var t_ctor=t_ty.p_GetClass().p_FindFuncDecl("new",[t_expr],1);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<103>";
		var t_=((((t_ctor)!=null) && t_ctor.p_IsCtor())?1:0);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<105>";
	var t_2=((object_downcast((t_ty),c_NumericType)!=null || object_downcast((t_ty),c_StringType)!=null)?1:0);
	pop_err();
	return t_2;
}
c_IntType.prototype.p_GetClass=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<109>";
	var t_=object_downcast((bb_decl__env.p_FindDecl("int")),c_ClassDecl);
	pop_err();
	return t_;
}
c_IntType.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<113>";
	pop_err();
	return "Int";
}
function bb_config_StringToInt(t_str,t_base){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<189>";
	var t_i=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<190>";
	var t_l=t_str.length;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<191>";
	while(t_i<t_l && t_str.charCodeAt(t_i)<=32){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<192>";
		t_i+=1;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<194>";
	var t_neg=false;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<195>";
	if(t_i<t_l && (t_str.charCodeAt(t_i)==43 || t_str.charCodeAt(t_i)==45)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<196>";
		t_neg=t_str.charCodeAt(t_i)==45;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<197>";
		t_i+=1;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<199>";
	var t_n=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<200>";
	while(t_i<t_l){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<201>";
		var t_c=t_str.charCodeAt(t_i);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<201>";
		var t_t=0;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<202>";
		if(t_c>=48 && t_c<58){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<203>";
			t_t=t_c-48;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<204>";
			if(t_c>=65 && t_c<=90){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<205>";
				t_t=t_c-55;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<206>";
				if(t_c>=97 && t_c<=122){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<207>";
					t_t=t_c-87;
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<209>";
					break;
				}
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<211>";
		if(t_t>=t_base){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<211>";
			break;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<212>";
		t_n=t_n*t_base+t_t;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<213>";
		t_i+=1;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<215>";
	if(t_neg){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<215>";
		t_n=-t_n;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<216>";
	pop_err();
	return t_n;
}
function c_FloatType(){
	c_NumericType.call(this);
}
c_FloatType.prototype=extend_class(c_NumericType);
c_FloatType.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<117>";
	c_NumericType.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<117>";
	pop_err();
	return this;
}
c_FloatType.prototype.p_EqualsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<120>";
	var t_=((object_downcast((t_ty),c_FloatType)!=null)?1:0);
	pop_err();
	return t_;
}
c_FloatType.prototype.p_ExtendsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<124>";
	if((object_downcast((t_ty),c_ObjectType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<125>";
		var t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(this),"")).p_Semant();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<126>";
		var t_ctor=t_ty.p_GetClass().p_FindFuncDecl("new",[t_expr],1);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<127>";
		var t_=((((t_ctor)!=null) && t_ctor.p_IsCtor())?1:0);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<129>";
	var t_2=((object_downcast((t_ty),c_NumericType)!=null || object_downcast((t_ty),c_StringType)!=null)?1:0);
	pop_err();
	return t_2;
}
c_FloatType.prototype.p_GetClass=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<133>";
	var t_=object_downcast((bb_decl__env.p_FindDecl("float")),c_ClassDecl);
	pop_err();
	return t_;
}
c_FloatType.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<137>";
	pop_err();
	return "Float";
}
function bb_config_InternalErr(t_err){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<70>";
	print(bb_config__errInfo+" : "+t_err);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<71>";
	error(bb_config__errInfo+" : "+t_err);
	pop_err();
	return 0;
}
function c_List2(){
	Object.call(this);
	this.m__head=(c_HeadNode2.m_new.call(new c_HeadNode2));
}
c_List2.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List2.prototype.p_AddLast2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<126>";
	var t_=c_Node5.m_new.call(new c_Node5,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List2.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<14>";
		this.p_AddLast2(t_t);
	}
	pop_err();
	return this;
}
c_List2.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<168>";
	var t_=c_Enumerator2.m_new.call(new c_Enumerator2,this);
	pop_err();
	return t_;
}
function c_Node5(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node5.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<243>";
	this.m__succ=t_succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<244>";
	this.m__pred=t_pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<245>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<246>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<247>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node5.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<240>";
	pop_err();
	return this;
}
function c_HeadNode2(){
	c_Node5.call(this);
}
c_HeadNode2.prototype=extend_class(c_Node5);
c_HeadNode2.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<292>";
	c_Node5.m_new2.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<293>";
	this.m__succ=(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<294>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_BlockDecl(){
	c_ScopeDecl.call(this);
	this.m_stmts=c_List5.m_new.call(new c_List5);
}
c_BlockDecl.prototype=extend_class(c_ScopeDecl);
c_BlockDecl.m_new=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<607>";
	c_ScopeDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<608>";
	dbg_object(this).m_scope=t_scope;
	pop_err();
	return this;
}
c_BlockDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<604>";
	c_ScopeDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<604>";
	pop_err();
	return this;
}
c_BlockDecl.prototype.p_AddStmt=function(t_stmt){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<613>";
	this.m_stmts.p_AddLast5(t_stmt);
	pop_err();
	return 0;
}
c_BlockDecl.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<625>";
	bb_decl_PushEnv(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<626>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<626>";
	var t_=this.m_stmts.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<626>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<626>";
		var t_stmt=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<627>";
		t_stmt.p_Semant();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<629>";
	bb_decl_PopEnv();
	pop_err();
	return 0;
}
c_BlockDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<617>";
	var t_t=c_BlockDecl.m_new2.call(new c_BlockDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<618>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<618>";
	var t_=this.m_stmts.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<618>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<618>";
		var t_stmt=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<619>";
		t_t.p_AddStmt(t_stmt.p_Copy2(t_t));
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<621>";
	var t_2=(t_t);
	pop_err();
	return t_2;
}
c_BlockDecl.prototype.p_CopyBlock=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<633>";
	var t_t=object_downcast((this.p_Copy()),c_BlockDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<634>";
	dbg_object(t_t).m_scope=t_scope;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<635>";
	pop_err();
	return t_t;
}
function c_FuncDecl(){
	c_BlockDecl.call(this);
	this.m_argDecls=[];
	this.m_retType=null;
	this.m_overrides=null;
}
c_FuncDecl.prototype=extend_class(c_BlockDecl);
c_FuncDecl.prototype.p_IsCtor=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<756>";
	var t_=(this.m_attrs&2)!=0;
	pop_err();
	return t_;
}
c_FuncDecl.prototype.p_IsMethod=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<760>";
	var t_=(this.m_attrs&1)!=0;
	pop_err();
	return t_;
}
c_FuncDecl.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<739>";
	var t_t="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<740>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<740>";
	var t_=this.m_argDecls;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<740>";
	var t_2=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<740>";
	while(t_2<t_.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<740>";
		var t_decl=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<740>";
		t_2=t_2+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<741>";
		if((t_t).length!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<741>";
			t_t=t_t+",";
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<742>";
		t_t=t_t+t_decl.p_ToString();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<744>";
	var t_q="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<745>";
	if(this.p_IsCtor()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<746>";
		t_q="Method "+c_Decl.prototype.p_ToString.call(this);
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<748>";
		if(this.p_IsMethod()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<748>";
			t_q="Method ";
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<748>";
			t_q="Function ";
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<749>";
		t_q=t_q+(c_Decl.prototype.p_ToString.call(this)+":");
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<750>";
		t_q=t_q+this.m_retType.p_ToString();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<752>";
	var t_3=t_q+"("+t_t+")";
	pop_err();
	return t_3;
}
c_FuncDecl.prototype.p_EqualsArgs=function(t_decl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<772>";
	if(this.m_argDecls.length!=dbg_object(t_decl).m_argDecls.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<772>";
		pop_err();
		return false;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<773>";
	for(var t_i=0;t_i<this.m_argDecls.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<774>";
		if(!((dbg_object(dbg_array(this.m_argDecls,t_i)[dbg_index]).m_type.p_EqualsType(dbg_object(dbg_array(dbg_object(t_decl).m_argDecls,t_i)[dbg_index]).m_type))!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<774>";
			pop_err();
			return false;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<776>";
	pop_err();
	return true;
}
c_FuncDecl.prototype.p_EqualsFunc=function(t_decl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<780>";
	var t_=((this.m_retType.p_EqualsType(dbg_object(t_decl).m_retType))!=0) && this.p_EqualsArgs(t_decl);
	pop_err();
	return t_;
}
c_FuncDecl.m_new=function(t_ident,t_attrs,t_retType,t_argDecls){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<654>";
	c_BlockDecl.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<655>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<656>";
	dbg_object(this).m_attrs=t_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<657>";
	dbg_object(this).m_retType=t_retType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<658>";
	dbg_object(this).m_argDecls=t_argDecls;
	pop_err();
	return this;
}
c_FuncDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<647>";
	c_BlockDecl.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<647>";
	pop_err();
	return this;
}
c_FuncDecl.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<676>";
	var t_cdecl=this.p_ClassScope();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<676>";
	var t_sclass=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<678>";
	if((t_cdecl)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<678>";
		t_sclass=dbg_object(t_cdecl).m_superClass;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<681>";
	if(this.p_IsCtor()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<682>";
		this.m_retType=(dbg_object(t_cdecl).m_objectType);
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<684>";
		this.m_retType=this.m_retType.p_Semant();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<688>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<688>";
	var t_=this.m_argDecls;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<688>";
	var t_2=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<688>";
	while(t_2<t_.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<688>";
		var t_arg=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<688>";
		t_2=t_2+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<689>";
		this.p_InsertDecl(t_arg);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<690>";
		t_arg.p_Semant();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<694>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<694>";
	var t_3=this.m_scope.p_SemantedFuncs(this.m_ident).p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<694>";
	while(t_3.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<694>";
		var t_decl=t_3.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<695>";
		if(t_decl!=this && this.p_EqualsArgs(t_decl)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<696>";
			bb_config_Err("Duplicate declaration "+this.p_ToString());
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<701>";
	if(this.p_IsCtor() && !((this.m_attrs&8)!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<702>";
		if((t_sclass.p_FindFuncDecl("new",[],0))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<703>";
			var t_expr=c_InvokeSuperExpr.m_new.call(new c_InvokeSuperExpr,"new",[]);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<704>";
			this.m_stmts.p_AddFirst(c_ExprStmt.m_new.call(new c_ExprStmt,(t_expr)));
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<709>";
	if(((t_sclass)!=null) && this.p_IsMethod()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<710>";
		while((t_sclass)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<711>";
			var t_found=0;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<712>";
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<712>";
			var t_4=t_sclass.p_MethodDecls(this.m_ident).p_ObjectEnumerator();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<712>";
			while(t_4.p_HasNext()){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<712>";
				var t_decl2=t_4.p_NextObject();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<713>";
				t_found=1;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<714>";
				t_decl2.p_Semant();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<715>";
				if(this.p_EqualsFunc(t_decl2)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<716>";
					this.m_overrides=t_decl2;
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<717>";
					break;
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<720>";
			if((t_found)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<721>";
				if(!((this.m_overrides)!=null)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<721>";
					bb_config_Err("Overriding method does not match any overridden method.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<722>";
				if((this.m_overrides.p_IsFinal())!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<722>";
					bb_config_Err("Cannot override final method.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<723>";
				if((dbg_object(this.m_overrides).m_munged).length!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<724>";
					if(((this.m_munged).length!=0) && this.m_munged!=dbg_object(this.m_overrides).m_munged){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<724>";
						bb_config_InternalErr("Internal error");
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<725>";
					this.m_munged=dbg_object(this.m_overrides).m_munged;
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<727>";
				break;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<729>";
			t_sclass=dbg_object(t_sclass).m_superClass;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<733>";
	this.m_attrs|=1048576;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<735>";
	c_BlockDecl.prototype.p_OnSemant.call(this);
	pop_err();
	return 0;
}
c_FuncDecl.prototype.p_IsStatic=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<764>";
	var t_=(this.m_attrs&3)==0;
	pop_err();
	return t_;
}
c_FuncDecl.prototype.p_IsProperty=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<768>";
	var t_=(this.m_attrs&4)!=0;
	pop_err();
	return t_;
}
c_FuncDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<662>";
	var t_args=this.m_argDecls.slice(0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<663>";
	for(var t_i=0;t_i<t_args.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<664>";
		dbg_array(t_args,t_i)[dbg_index]=object_downcast((dbg_array(t_args,t_i)[dbg_index].p_Copy()),c_ArgDecl)
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<666>";
	var t_t=c_FuncDecl.m_new.call(new c_FuncDecl,this.m_ident,this.m_attrs,this.m_retType,t_args);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<667>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<667>";
	var t_=this.m_stmts.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<667>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<667>";
		var t_stmt=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<668>";
		t_t.p_AddStmt(t_stmt.p_Copy2(t_t));
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<670>";
	var t_2=(t_t);
	pop_err();
	return t_2;
}
function c_List3(){
	Object.call(this);
	this.m__head=(c_HeadNode3.m_new.call(new c_HeadNode3));
}
c_List3.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List3.prototype.p_AddLast3=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<126>";
	var t_=c_Node6.m_new.call(new c_Node6,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List3.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<14>";
		this.p_AddLast3(t_t);
	}
	pop_err();
	return this;
}
c_List3.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<168>";
	var t_=c_Enumerator.m_new.call(new c_Enumerator,this);
	pop_err();
	return t_;
}
function c_FuncDeclList(){
	c_List3.call(this);
}
c_FuncDeclList.prototype=extend_class(c_List3);
c_FuncDeclList.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<38>";
	c_List3.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<38>";
	pop_err();
	return this;
}
function c_Node6(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node6.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<243>";
	this.m__succ=t_succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<244>";
	this.m__pred=t_pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<245>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<246>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<247>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node6.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<240>";
	pop_err();
	return this;
}
function c_HeadNode3(){
	c_Node6.call(this);
}
c_HeadNode3.prototype=extend_class(c_Node6);
c_HeadNode3.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<292>";
	c_Node6.m_new2.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<293>";
	this.m__succ=(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<294>";
	this.m__pred=(this);
	pop_err();
	return this;
}
var bb_decl__env=null;
function c_List4(){
	Object.call(this);
	this.m__head=(c_HeadNode4.m_new.call(new c_HeadNode4));
}
c_List4.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List4.prototype.p_AddLast4=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<126>";
	var t_=c_Node7.m_new.call(new c_Node7,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List4.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<14>";
		this.p_AddLast4(t_t);
	}
	pop_err();
	return this;
}
c_List4.prototype.p_IsEmpty=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<50>";
	var t_=dbg_object(this.m__head).m__succ==this.m__head;
	pop_err();
	return t_;
}
c_List4.prototype.p_RemoveLast=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<94>";
	if(this.p_IsEmpty()){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<94>";
		error("Illegal operation on empty list");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<96>";
	var t_data=dbg_object(this.m__head.p_PrevNode()).m__data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<97>";
	dbg_object(this.m__head).m__pred.p_Remove();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<98>";
	pop_err();
	return t_data;
}
function c_Node7(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node7.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<243>";
	this.m__succ=t_succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<244>";
	this.m__pred=t_pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<245>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<246>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<247>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node7.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<240>";
	pop_err();
	return this;
}
c_Node7.prototype.p_GetNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<283>";
	pop_err();
	return this;
}
c_Node7.prototype.p_PrevNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<271>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<271>";
		error("Illegal operation on removed node");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<273>";
	var t_=this.m__pred.p_GetNode();
	pop_err();
	return t_;
}
c_Node7.prototype.p_Remove=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<256>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<256>";
		error("Illegal operation on removed node");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<258>";
	dbg_object(this.m__succ).m__pred=this.m__pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<259>";
	dbg_object(this.m__pred).m__succ=this.m__succ;
	pop_err();
	return 0;
}
function c_HeadNode4(){
	c_Node7.call(this);
}
c_HeadNode4.prototype=extend_class(c_Node7);
c_HeadNode4.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<292>";
	c_Node7.m_new2.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<293>";
	this.m__succ=(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<294>";
	this.m__pred=(this);
	pop_err();
	return this;
}
c_HeadNode4.prototype.p_GetNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<298>";
	pop_err();
	return null;
}
var bb_decl__envStack=null;
function bb_decl_PushEnv(t_env){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<29>";
	bb_decl__envStack.p_AddLast4(bb_decl__env);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<30>";
	bb_decl__env=t_env;
	pop_err();
	return 0;
}
function c_UnaryExpr(){
	c_Expr.call(this);
	this.m_op="";
	this.m_expr=null;
}
c_UnaryExpr.prototype=extend_class(c_Expr);
c_UnaryExpr.m_new=function(t_op,t_expr){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<670>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<671>";
	dbg_object(this).m_op=t_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<672>";
	dbg_object(this).m_expr=t_expr;
	pop_err();
	return this;
}
c_UnaryExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<667>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<667>";
	pop_err();
	return this;
}
c_UnaryExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<680>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<680>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<682>";
	var t_2=this.m_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<683>";
	if(t_2=="+" || t_2=="-"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<684>";
		this.m_expr=this.m_expr.p_Semant();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<685>";
		if(!((object_downcast((dbg_object(this.m_expr).m_exprType),c_NumericType))!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<685>";
			bb_config_Err(this.m_expr.p_ToString()+" must be numeric for use with unary operator '"+this.m_op+"'");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<686>";
		this.m_exprType=dbg_object(this.m_expr).m_exprType;
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<687>";
		if(t_2=="~"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<688>";
			this.m_expr=this.m_expr.p_Semant2((c_Type.m_intType),0);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<689>";
			this.m_exprType=(c_Type.m_intType);
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<690>";
			if(t_2=="not"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<691>";
				this.m_expr=this.m_expr.p_Semant2((c_Type.m_boolType),1);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<692>";
				this.m_exprType=(c_Type.m_boolType);
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<694>";
				bb_config_InternalErr("Internal error");
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<697>";
	if((object_downcast((this.m_expr),c_ConstExpr))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<697>";
		var t_3=this.p_EvalConst();
		pop_err();
		return t_3;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<699>";
	var t_4=(this);
	pop_err();
	return t_4;
}
c_UnaryExpr.prototype.p_Eval=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<703>";
	var t_val=this.m_expr.p_Eval();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<704>";
	var t_=this.m_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<705>";
	if(t_=="~"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<706>";
		var t_2=String(~parseInt((t_val),10));
		pop_err();
		return t_2;
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<707>";
		if(t_=="+"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<708>";
			pop_err();
			return t_val;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<709>";
			if(t_=="-"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<710>";
				if(string_startswith(t_val,"-")){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<710>";
					var t_3=t_val.slice(1);
					pop_err();
					return t_3;
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<711>";
				var t_4="-"+t_val;
				pop_err();
				return t_4;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<712>";
				if(t_=="not"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<713>";
					if((t_val).length!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<713>";
						pop_err();
						return "";
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<714>";
					pop_err();
					return "1";
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<716>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return "";
}
c_UnaryExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<676>";
	var t_=(c_UnaryExpr.m_new.call(new c_UnaryExpr,this.m_op,this.p_CopyExpr(this.m_expr)));
	pop_err();
	return t_;
}
function c_ArrayExpr(){
	c_Expr.call(this);
	this.m_exprs=[];
}
c_ArrayExpr.prototype=extend_class(c_Expr);
c_ArrayExpr.m_new=function(t_exprs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1048>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1049>";
	dbg_object(this).m_exprs=t_exprs;
	pop_err();
	return this;
}
c_ArrayExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1045>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1045>";
	pop_err();
	return this;
}
c_ArrayExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1057>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1057>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1059>";
	dbg_array(this.m_exprs,0)[dbg_index]=dbg_array(this.m_exprs,0)[dbg_index].p_Semant()
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1060>";
	var t_ty=dbg_object(dbg_array(this.m_exprs,0)[dbg_index]).m_exprType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1062>";
	for(var t_i=1;t_i<this.m_exprs.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1063>";
		dbg_array(this.m_exprs,t_i)[dbg_index]=dbg_array(this.m_exprs,t_i)[dbg_index].p_Semant()
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1064>";
		t_ty=this.p_BalanceTypes(t_ty,dbg_object(dbg_array(this.m_exprs,t_i)[dbg_index]).m_exprType);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1067>";
	for(var t_i2=0;t_i2<this.m_exprs.length;t_i2=t_i2+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1068>";
		dbg_array(this.m_exprs,t_i2)[dbg_index]=dbg_array(this.m_exprs,t_i2)[dbg_index].p_Cast(t_ty,0)
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1071>";
	this.m_exprType=(t_ty.p_ArrayOf());
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1072>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_ArrayExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1053>";
	var t_=(c_ArrayExpr.m_new.call(new c_ArrayExpr,this.p_CopyArgs(this.m_exprs)));
	pop_err();
	return t_;
}
function c_Stack2(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack2.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_Stack2.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<13>";
	dbg_object(this).m_data=t_data.slice(0);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<14>";
	dbg_object(this).m_length=t_data.length;
	pop_err();
	return this;
}
c_Stack2.prototype.p_Push4=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<55>";
	if(this.m_length==this.m_data.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<56>";
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<58>";
	dbg_array(this.m_data,this.m_length)[dbg_index]=t_value
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<59>";
	this.m_length+=1;
	pop_err();
	return 0;
}
c_Stack2.prototype.p_Push5=function(t_values,t_offset,t_count){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<69>";
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<70>";
		this.p_Push4(dbg_array(t_values,t_offset+t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack2.prototype.p_Push6=function(t_values,t_offset){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<63>";
	for(var t_i=t_offset;t_i<t_values.length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<64>";
		this.p_Push4(dbg_array(t_values,t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack2.prototype.p_ToArray=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<18>";
	var t_t=new_object_array(this.m_length);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<19>";
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<20>";
		dbg_array(t_t,t_i)[dbg_index]=dbg_array(this.m_data,t_i)[dbg_index]
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<22>";
	pop_err();
	return t_t;
}
function c_ArrayType(){
	c_Type.call(this);
	this.m_elemType=null;
}
c_ArrayType.prototype=extend_class(c_Type);
c_ArrayType.m_new=function(t_elemType){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<169>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<170>";
	dbg_object(this).m_elemType=t_elemType;
	pop_err();
	return this;
}
c_ArrayType.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<166>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<166>";
	pop_err();
	return this;
}
c_ArrayType.prototype.p_EqualsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<174>";
	var t_arrayType=object_downcast((t_ty),c_ArrayType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<175>";
	var t_=((((t_arrayType)!=null) && ((this.m_elemType.p_EqualsType(dbg_object(t_arrayType).m_elemType))!=0))?1:0);
	pop_err();
	return t_;
}
c_ArrayType.prototype.p_ExtendsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<179>";
	var t_arrayType=object_downcast((t_ty),c_ArrayType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<180>";
	var t_=((((t_arrayType)!=null) && (((object_downcast((this.m_elemType),c_VoidType))!=null) || ((this.m_elemType.p_EqualsType(dbg_object(t_arrayType).m_elemType))!=0)))?1:0);
	pop_err();
	return t_;
}
c_ArrayType.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<184>";
	var t_ty=this.m_elemType.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<185>";
	if(t_ty!=this.m_elemType){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<185>";
		var t_=(c_ArrayType.m_new.call(new c_ArrayType,t_ty));
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<186>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_ArrayType.prototype.p_GetClass=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<190>";
	var t_=object_downcast((bb_decl__env.p_FindDecl("array")),c_ClassDecl);
	pop_err();
	return t_;
}
c_ArrayType.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<194>";
	var t_=this.m_elemType.p_ToString()+"[]";
	pop_err();
	return t_;
}
function c_VoidType(){
	c_Type.call(this);
}
c_VoidType.prototype=extend_class(c_Type);
c_VoidType.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<52>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<52>";
	pop_err();
	return this;
}
c_VoidType.prototype.p_EqualsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<55>";
	var t_=((object_downcast((t_ty),c_VoidType)!=null)?1:0);
	pop_err();
	return t_;
}
c_VoidType.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<59>";
	pop_err();
	return "Void";
}
function c_ScopeExpr(){
	c_Expr.call(this);
	this.m_scope=null;
}
c_ScopeExpr.prototype=extend_class(c_Expr);
c_ScopeExpr.m_new=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<14>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<15>";
	dbg_object(this).m_scope=t_scope;
	pop_err();
	return this;
}
c_ScopeExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<11>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<11>";
	pop_err();
	return this;
}
c_ScopeExpr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<23>";
	print("ScopeExpr("+this.m_scope.p_ToString()+")");
	pop_err();
	return "";
}
c_ScopeExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<27>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return null;
}
c_ScopeExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<19>";
	var t_=(this);
	pop_err();
	return t_;
}
c_ScopeExpr.prototype.p_SemantScope=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<31>";
	pop_err();
	return this.m_scope;
}
function c_IdentType(){
	c_Type.call(this);
	this.m_ident="";
	this.m_args=[];
}
c_IdentType.prototype=extend_class(c_Type);
c_IdentType.m_new=function(t_ident,t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<243>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<244>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<245>";
	dbg_object(this).m_args=t_args;
	pop_err();
	return this;
}
c_IdentType.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<239>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<239>";
	pop_err();
	return this;
}
c_IdentType.prototype.p_EqualsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<249>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return 0;
}
c_IdentType.prototype.p_ExtendsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<253>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return 0;
}
c_IdentType.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<257>";
	if(!((this.m_ident).length!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<257>";
		var t_=(dbg_object(c_ClassDecl.m_nullObjectClass).m_objectType);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<259>";
	var t_targs=new_object_array(this.m_args.length);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<260>";
	for(var t_i=0;t_i<this.m_args.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<261>";
		dbg_array(t_targs,t_i)[dbg_index]=dbg_array(this.m_args,t_i)[dbg_index].p_Semant()
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<264>";
	var t_tyid="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<264>";
	var t_type=null;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<265>";
	var t_i2=this.m_ident.indexOf(".",0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<267>";
	if(t_i2==-1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<268>";
		t_tyid=this.m_ident;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<269>";
		t_type=bb_decl__env.p_FindType(t_tyid,t_targs);
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<271>";
		var t_modid=this.m_ident.slice(0,t_i2);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<272>";
		var t_mdecl=bb_decl__env.p_FindModuleDecl(t_modid);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<273>";
		if(!((t_mdecl)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<273>";
			bb_config_Err("Module '"+t_modid+"' not found");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<274>";
		t_tyid=this.m_ident.slice(t_i2+1);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<275>";
		t_type=t_mdecl.p_FindType(t_tyid,t_targs);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<277>";
	if(!((t_type)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<277>";
		bb_config_Err("Type '"+t_tyid+"' not found");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<278>";
	pop_err();
	return t_type;
}
c_IdentType.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<288>";
	var t_t="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<289>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<289>";
	var t_=this.m_args;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<289>";
	var t_2=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<289>";
	while(t_2<t_.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<289>";
		var t_arg=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<289>";
		t_2=t_2+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<290>";
		if((t_t).length!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<290>";
			t_t=t_t+",";
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<291>";
		t_t=t_t+t_arg.p_ToString();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<293>";
	if((t_t).length!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<293>";
		var t_3="$"+this.m_ident+"<"+string_replace(t_t,"$","")+">";
		pop_err();
		return t_3;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<294>";
	var t_4="$"+this.m_ident;
	pop_err();
	return t_4;
}
c_IdentType.prototype.p_SemantClass=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<282>";
	var t_type=object_downcast((this.p_Semant()),c_ObjectType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<283>";
	if(!((t_type)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<283>";
		bb_config_Err("Type is not a class");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<284>";
	pop_err();
	return dbg_object(t_type).m_classDecl;
}
function c_Stack3(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack3.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_Stack3.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<13>";
	dbg_object(this).m_data=t_data.slice(0);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<14>";
	dbg_object(this).m_length=t_data.length;
	pop_err();
	return this;
}
c_Stack3.prototype.p_Push7=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<55>";
	if(this.m_length==this.m_data.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<56>";
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<58>";
	dbg_array(this.m_data,this.m_length)[dbg_index]=t_value
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<59>";
	this.m_length+=1;
	pop_err();
	return 0;
}
c_Stack3.prototype.p_Push8=function(t_values,t_offset,t_count){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<69>";
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<70>";
		this.p_Push7(dbg_array(t_values,t_offset+t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack3.prototype.p_Push9=function(t_values,t_offset){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<63>";
	for(var t_i=t_offset;t_i<t_values.length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<64>";
		this.p_Push7(dbg_array(t_values,t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack3.prototype.p_ToArray=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<18>";
	var t_t=new_object_array(this.m_length);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<19>";
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<20>";
		dbg_array(t_t,t_i)[dbg_index]=dbg_array(this.m_data,t_i)[dbg_index]
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<22>";
	pop_err();
	return t_t;
}
function c_NewArrayExpr(){
	c_Expr.call(this);
	this.m_ty=null;
	this.m_expr=null;
}
c_NewArrayExpr.prototype=extend_class(c_Expr);
c_NewArrayExpr.m_new=function(t_ty,t_expr){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<427>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<428>";
	dbg_object(this).m_ty=t_ty;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<429>";
	dbg_object(this).m_expr=t_expr;
	pop_err();
	return this;
}
c_NewArrayExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<423>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<423>";
	pop_err();
	return this;
}
c_NewArrayExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<438>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<438>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<440>";
	this.m_ty=this.m_ty.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<441>";
	this.m_exprType=(this.m_ty.p_ArrayOf());
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<442>";
	this.m_expr=this.m_expr.p_Semant2((c_Type.m_intType),0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<443>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_NewArrayExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<433>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<433>";
		bb_config_InternalErr("Internal error");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<434>";
	var t_=(c_NewArrayExpr.m_new.call(new c_NewArrayExpr,this.m_ty,this.p_CopyExpr(this.m_expr)));
	pop_err();
	return t_;
}
function c_NewObjectExpr(){
	c_Expr.call(this);
	this.m_ty=null;
	this.m_args=[];
	this.m_classDecl=null;
	this.m_ctor=null;
}
c_NewObjectExpr.prototype=extend_class(c_Expr);
c_NewObjectExpr.m_new=function(t_ty,t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<378>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<379>";
	dbg_object(this).m_ty=t_ty;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<380>";
	dbg_object(this).m_args=t_args;
	pop_err();
	return this;
}
c_NewObjectExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<372>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<372>";
	pop_err();
	return this;
}
c_NewObjectExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<388>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<388>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<390>";
	this.m_ty=this.m_ty.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<391>";
	this.m_args=this.p_SemantArgs(this.m_args);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<393>";
	var t_objTy=object_downcast((this.m_ty),c_ObjectType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<394>";
	if(!((t_objTy)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<395>";
		bb_config_Err("Expression is not a class.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<398>";
	this.m_classDecl=dbg_object(t_objTy).m_classDecl;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<400>";
	if((this.m_classDecl.p_IsInterface())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<400>";
		bb_config_Err("Cannot create instance of an interface.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<401>";
	if((this.m_classDecl.p_IsAbstract())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<401>";
		bb_config_Err("Cannot create instance of an abstract class.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<402>";
	if(((dbg_object(this.m_classDecl).m_args).length!=0) && !((dbg_object(this.m_classDecl).m_instanceof)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<402>";
		bb_config_Err("Cannot create instance of a generic class.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<404>";
	if((this.m_classDecl.p_IsExtern())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<405>";
		if((this.m_args).length!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<405>";
			bb_config_Err("No suitable constructor found for class "+this.m_classDecl.p_ToString()+".");
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<407>";
		this.m_ctor=this.m_classDecl.p_FindFuncDecl("new",this.m_args,0);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<408>";
		if(!((this.m_ctor)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<408>";
			bb_config_Err("No suitable constructor found for class "+this.m_classDecl.p_ToString()+".");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<409>";
		this.m_args=this.p_CastArgs(this.m_args,this.m_ctor);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<412>";
	dbg_object(this.m_classDecl).m_attrs|=1;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<414>";
	this.m_exprType=this.m_ty;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<415>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_NewObjectExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<384>";
	var t_=(c_NewObjectExpr.m_new.call(new c_NewObjectExpr,this.m_ty,this.p_CopyArgs(this.m_args)));
	pop_err();
	return t_;
}
function c_CastExpr(){
	c_Expr.call(this);
	this.m_ty=null;
	this.m_expr=null;
	this.m_flags=0;
}
c_CastExpr.prototype=extend_class(c_Expr);
c_CastExpr.m_new=function(t_ty,t_expr,t_flags){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<535>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<536>";
	dbg_object(this).m_ty=t_ty;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<537>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<538>";
	dbg_object(this).m_flags=t_flags;
	pop_err();
	return this;
}
c_CastExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<530>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<530>";
	pop_err();
	return this;
}
c_CastExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<546>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<546>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<548>";
	this.m_ty=this.m_ty.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<549>";
	this.m_expr=this.m_expr.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<551>";
	var t_src=dbg_object(this.m_expr).m_exprType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<554>";
	if((t_src.p_EqualsType(this.m_ty))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<554>";
		pop_err();
		return this.m_expr;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<557>";
	if((t_src.p_ExtendsType(this.m_ty))!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<560>";
		if(((object_downcast((t_src),c_ArrayType))!=null) && ((object_downcast((dbg_object(object_downcast((t_src),c_ArrayType)).m_elemType),c_VoidType))!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<561>";
			var t_2=(c_ConstExpr.m_new.call(new c_ConstExpr,this.m_ty,"")).p_Semant();
			pop_err();
			return t_2;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<565>";
		if(((object_downcast((this.m_ty),c_ObjectType))!=null) && !((object_downcast((t_src),c_ObjectType))!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<568>";
			this.m_expr=(c_NewObjectExpr.m_new.call(new c_NewObjectExpr,this.m_ty,[this.m_expr])).p_Semant();
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<570>";
			if(((object_downcast((t_src),c_ObjectType))!=null) && !((object_downcast((this.m_ty),c_ObjectType))!=null)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<573>";
				var t_op="";
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<574>";
				if((object_downcast((this.m_ty),c_BoolType))!=null){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<575>";
					t_op="ToBool";
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<576>";
					if((object_downcast((this.m_ty),c_IntType))!=null){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<577>";
						t_op="ToInt";
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<578>";
						if((object_downcast((this.m_ty),c_FloatType))!=null){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<579>";
							t_op="ToFloat";
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<580>";
							if((object_downcast((this.m_ty),c_StringType))!=null){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<581>";
								t_op="ToString";
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<583>";
								bb_config_InternalErr("Internal error");
							}
						}
					}
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<585>";
				var t_fdecl=t_src.p_GetClass().p_FindFuncDecl(t_op,[],0);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<586>";
				this.m_expr=(c_InvokeMemberExpr.m_new.call(new c_InvokeMemberExpr,this.m_expr,t_fdecl,[])).p_Semant();
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<590>";
		this.m_exprType=this.m_ty;
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<592>";
		if((object_downcast((this.m_ty),c_BoolType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<594>";
			if((object_downcast((t_src),c_VoidType))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<595>";
				bb_config_Err("Cannot convert from Void to Bool.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<598>";
			if((this.m_flags&1)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<599>";
				this.m_exprType=this.m_ty;
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<602>";
			if((this.m_ty.p_ExtendsType(t_src))!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<604>";
				if((this.m_flags&1)!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<607>";
					if(object_downcast((this.m_ty),c_ObjectType)!=null==(object_downcast((t_src),c_ObjectType)!=null)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<607>";
						this.m_exprType=this.m_ty;
					}
				}
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<611>";
				if(((object_downcast((this.m_ty),c_ObjectType))!=null) && ((object_downcast((t_src),c_ObjectType))!=null)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<613>";
					if((this.m_flags&1)!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<615>";
						if(((t_src.p_GetClass().p_IsInterface())!=0) || ((this.m_ty.p_GetClass().p_IsInterface())!=0)){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<616>";
							this.m_exprType=this.m_ty;
						}
					}
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<623>";
	if(!((this.m_exprType)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<624>";
		bb_config_Err("Cannot convert from "+t_src.p_ToString()+" to "+this.m_ty.p_ToString()+".");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<627>";
	if((object_downcast((this.m_expr),c_ConstExpr))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<627>";
		var t_3=this.p_EvalConst();
		pop_err();
		return t_3;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<629>";
	var t_4=(this);
	pop_err();
	return t_4;
}
c_CastExpr.prototype.p_Eval=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<633>";
	var t_val=this.m_expr.p_Eval();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<634>";
	if(!((t_val).length!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<634>";
		pop_err();
		return t_val;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<635>";
	if((object_downcast((this.m_exprType),c_BoolType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<636>";
		if((object_downcast((dbg_object(this.m_expr).m_exprType),c_IntType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<637>";
			if((parseInt((t_val),10))!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<637>";
				pop_err();
				return "1";
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<638>";
			pop_err();
			return "";
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<639>";
			if((object_downcast((dbg_object(this.m_expr).m_exprType),c_FloatType))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<640>";
				if((parseFloat(t_val))!=0.0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<640>";
					pop_err();
					return "1";
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<641>";
				pop_err();
				return "";
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<642>";
				if((object_downcast((dbg_object(this.m_expr).m_exprType),c_StringType))!=null){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<643>";
					if((t_val.length)!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<643>";
						pop_err();
						return "1";
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<644>";
					pop_err();
					return "";
				}
			}
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<646>";
		if((object_downcast((this.m_exprType),c_IntType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<647>";
			if((object_downcast((dbg_object(this.m_expr).m_exprType),c_BoolType))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<648>";
				if((t_val).length!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<648>";
					pop_err();
					return "1";
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<649>";
				pop_err();
				return "0";
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<651>";
			var t_=String(parseInt((t_val),10));
			pop_err();
			return t_;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<652>";
			if((object_downcast((this.m_exprType),c_FloatType))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<653>";
				var t_2=String(parseFloat(t_val));
				pop_err();
				return t_2;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<654>";
				if((object_downcast((this.m_exprType),c_StringType))!=null){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<655>";
					pop_err();
					return t_val;
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<657>";
	var t_3=c_Expr.prototype.p_Eval.call(this);
	pop_err();
	return t_3;
}
c_CastExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<542>";
	var t_=(c_CastExpr.m_new.call(new c_CastExpr,this.m_ty,this.p_CopyExpr(this.m_expr),this.m_flags));
	pop_err();
	return t_;
}
function c_IdentExpr(){
	c_Expr.call(this);
	this.m_ident="";
	this.m_expr=null;
	this.m_scope=null;
	this.m_static=false;
}
c_IdentExpr.prototype=extend_class(c_Expr);
c_IdentExpr.m_new=function(t_ident,t_expr){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<164>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<165>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<166>";
	dbg_object(this).m_expr=t_expr;
	pop_err();
	return this;
}
c_IdentExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<158>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<158>";
	pop_err();
	return this;
}
c_IdentExpr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<174>";
	var t_t="IdentExpr(\""+this.m_ident+"\"";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<175>";
	if((this.m_expr)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<175>";
		t_t=t_t+(","+this.m_expr.p_ToString());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<176>";
	var t_=t_t+")";
	pop_err();
	return t_;
}
c_IdentExpr.prototype.p__Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<181>";
	if((this.m_scope)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<181>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<183>";
	if((this.m_expr)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<184>";
		this.m_scope=this.m_expr.p_SemantScope();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<185>";
		if((this.m_scope)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<186>";
			this.m_static=true;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<188>";
			this.m_expr=this.m_expr.p_Semant();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<189>";
			this.m_scope=(dbg_object(this.m_expr).m_exprType.p_GetClass());
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<190>";
			if(!((this.m_scope)!=null)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<190>";
				bb_config_Err("Expression has no scope");
			}
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<193>";
		this.m_scope=bb_decl__env;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<194>";
		this.m_static=bb_decl__env.p_FuncScope()==null || bb_decl__env.p_FuncScope().p_IsStatic();
	}
	pop_err();
	return 0;
}
c_IdentExpr.prototype.p_IdentErr=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<200>";
	var t_close="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<201>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<201>";
	var t_=this.m_scope.p_Decls().p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<201>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<201>";
		var t_decl=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<202>";
		if(this.m_ident.toLowerCase()==dbg_object(t_decl).m_ident.toLowerCase()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<203>";
			t_close=dbg_object(t_decl).m_ident;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<206>";
	if(((t_close).length!=0) && this.m_ident!=t_close){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<206>";
		bb_config_Err("Identifier '"+this.m_ident+"' not found - perhaps you meant '"+t_close+"'?");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<207>";
	bb_config_Err("Identifier '"+this.m_ident+"' not found.");
	pop_err();
	return 0;
}
c_IdentExpr.prototype.p_SemantSet=function(t_op,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<218>";
	this.p__Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<220>";
	var t_vdecl=this.m_scope.p_FindValDecl(this.m_ident);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<221>";
	if((t_vdecl)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<222>";
		if((object_downcast((t_vdecl),c_ConstDecl))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<223>";
			if((t_rhs)!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<223>";
				bb_config_Err("Constant '"+this.m_ident+"' cannot be modified.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<224>";
			var t_cexpr=c_ConstExpr.m_new.call(new c_ConstExpr,dbg_object(t_vdecl).m_type,dbg_object(object_downcast((t_vdecl),c_ConstDecl)).m_value);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<226>";
			if(!this.m_static && (((object_downcast((this.m_expr),c_InvokeExpr))!=null) || ((object_downcast((this.m_expr),c_InvokeMemberExpr))!=null))){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<226>";
				var t_=(c_StmtExpr.m_new.call(new c_StmtExpr,(c_ExprStmt.m_new.call(new c_ExprStmt,this.m_expr)),(t_cexpr))).p_Semant();
				pop_err();
				return t_;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<227>";
			var t_2=t_cexpr.p_Semant();
			pop_err();
			return t_2;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<228>";
			if((object_downcast((t_vdecl),c_FieldDecl))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<229>";
				if(this.m_static){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<229>";
					bb_config_Err("Field '"+this.m_ident+"' cannot be accessed from here.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<230>";
				if((this.m_expr)!=null){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<230>";
					var t_3=(c_MemberVarExpr.m_new.call(new c_MemberVarExpr,this.m_expr,object_downcast((t_vdecl),c_VarDecl))).p_Semant();
					pop_err();
					return t_3;
				}
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<232>";
		var t_4=(c_VarExpr.m_new.call(new c_VarExpr,object_downcast((t_vdecl),c_VarDecl))).p_Semant();
		pop_err();
		return t_4;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<235>";
	if(((t_op).length!=0) && t_op!="="){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<237>";
		var t_fdecl=this.m_scope.p_FindFuncDecl(this.m_ident,[],0);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<238>";
		if(!((t_fdecl)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<238>";
			this.p_IdentErr();
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<240>";
		if(((bb_decl__env.p_ModuleScope().p_IsStrict())!=0) && !t_fdecl.p_IsProperty()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<240>";
			bb_config_Err("Identifier '"+this.m_ident+"' cannot be used in this way.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<242>";
		var t_lhs=null;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<244>";
		if(t_fdecl.p_IsStatic() || this.m_scope==bb_decl__env && !bb_decl__env.p_FuncScope().p_IsStatic()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<245>";
			t_lhs=(c_InvokeExpr.m_new.call(new c_InvokeExpr,t_fdecl,[]));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<246>";
			if((this.m_expr)!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<247>";
				var t_tmp=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,null,this.m_expr);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<248>";
				t_lhs=(c_InvokeMemberExpr.m_new.call(new c_InvokeMemberExpr,(c_VarExpr.m_new.call(new c_VarExpr,(t_tmp))),t_fdecl,[]));
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<249>";
				t_lhs=(c_StmtExpr.m_new.call(new c_StmtExpr,(c_DeclStmt.m_new.call(new c_DeclStmt,(t_tmp))),t_lhs));
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<251>";
				pop_err();
				return null;
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<254>";
		var t_bop=t_op.slice(0,1);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<255>";
		var t_5=t_bop;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<256>";
		if(t_5=="*" || t_5=="/" || t_5=="shl" || t_5=="shr" || t_5=="+" || t_5=="-" || t_5=="&" || t_5=="|" || t_5=="~"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<257>";
			t_rhs=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_bop,t_lhs,t_rhs));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<259>";
			bb_config_InternalErr("Internal error");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<261>";
		t_rhs=t_rhs.p_Semant();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<264>";
	var t_args=[];
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<265>";
	if((t_rhs)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<265>";
		t_args=[t_rhs];
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<267>";
	var t_fdecl2=this.m_scope.p_FindFuncDecl(this.m_ident,t_args,0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<268>";
	if((t_fdecl2)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<270>";
		if(((bb_decl__env.p_ModuleScope().p_IsStrict())!=0) && !t_fdecl2.p_IsProperty()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<270>";
			bb_config_Err("Identifier '"+this.m_ident+"' cannot be used in this way.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<272>";
		if(!t_fdecl2.p_IsStatic()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<273>";
			if(this.m_static){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<273>";
				bb_config_Err("Method '"+this.m_ident+"' cannot be accessed from here.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<274>";
			if((this.m_expr)!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<274>";
				var t_6=(c_InvokeMemberExpr.m_new.call(new c_InvokeMemberExpr,this.m_expr,t_fdecl2,t_args)).p_Semant();
				pop_err();
				return t_6;
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<276>";
		var t_7=(c_InvokeExpr.m_new.call(new c_InvokeExpr,t_fdecl2,t_args)).p_Semant();
		pop_err();
		return t_7;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<279>";
	this.p_IdentErr();
	pop_err();
	return null;
}
c_IdentExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<212>";
	var t_=this.p_SemantSet("",null);
	pop_err();
	return t_;
}
c_IdentExpr.prototype.p_SemantScope=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<306>";
	this.p__Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<308>";
	var t_=this.m_scope.p_FindScopeDecl(this.m_ident);
	pop_err();
	return t_;
}
c_IdentExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<170>";
	var t_=(c_IdentExpr.m_new.call(new c_IdentExpr,this.m_ident,this.p_CopyExpr(this.m_expr)));
	pop_err();
	return t_;
}
c_IdentExpr.prototype.p_SemantFunc=function(t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<284>";
	this.p__Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<286>";
	var t_fdecl=this.m_scope.p_FindFuncDecl(this.m_ident,t_args,0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<287>";
	if((t_fdecl)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<288>";
		if(!t_fdecl.p_IsStatic()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<289>";
			if(this.m_static){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<289>";
				bb_config_Err("Method '"+this.m_ident+"' cannot be accessed from here.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<290>";
			if((this.m_expr)!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<290>";
				var t_=(c_InvokeMemberExpr.m_new.call(new c_InvokeMemberExpr,this.m_expr,t_fdecl,t_args)).p_Semant();
				pop_err();
				return t_;
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<292>";
		var t_2=(c_InvokeExpr.m_new.call(new c_InvokeExpr,t_fdecl,t_args)).p_Semant();
		pop_err();
		return t_2;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<295>";
	var t_type=this.m_scope.p_FindType(this.m_ident,[]);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<296>";
	if((t_type)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<297>";
		if(t_args.length==1 && ((dbg_array(t_args,0)[dbg_index])!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<297>";
			var t_3=dbg_array(t_args,0)[dbg_index].p_Cast(t_type,1);
			pop_err();
			return t_3;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<298>";
		bb_config_Err("Illegal number of arguments for type conversion");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<301>";
	this.p_IdentErr();
	pop_err();
	return null;
}
function c_SelfExpr(){
	c_Expr.call(this);
}
c_SelfExpr.prototype=extend_class(c_Expr);
c_SelfExpr.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<499>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<499>";
	pop_err();
	return this;
}
c_SelfExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<510>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<510>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<512>";
	if((bb_decl__env.p_FuncScope())!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<513>";
		if(bb_decl__env.p_FuncScope().p_IsStatic()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<513>";
			bb_config_Err("Illegal use of Self within static scope.");
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<515>";
		bb_config_Err("Self cannot be used here.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<518>";
	this.m_exprType=(dbg_object(bb_decl__env.p_ClassScope()).m_objectType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<519>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_SelfExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<502>";
	var t_=(c_SelfExpr.m_new.call(new c_SelfExpr));
	pop_err();
	return t_;
}
c_SelfExpr.prototype.p_SideEffects=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<506>";
	pop_err();
	return false;
}
function c_Stmt(){
	Object.call(this);
	this.m_errInfo="";
}
c_Stmt.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<13>";
	this.m_errInfo=bb_config__errInfo;
	pop_err();
	return this;
}
c_Stmt.prototype.p_OnSemant=function(){
}
c_Stmt.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<27>";
	bb_config_PushErr(this.m_errInfo);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<28>";
	this.p_OnSemant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<29>";
	bb_config_PopErr();
	pop_err();
	return 0;
}
c_Stmt.prototype.p_OnCopy2=function(t_scope){
}
c_Stmt.prototype.p_Copy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<21>";
	var t_t=this.p_OnCopy2(t_scope);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<22>";
	dbg_object(t_t).m_errInfo=this.m_errInfo;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<23>";
	pop_err();
	return t_t;
}
function c_List5(){
	Object.call(this);
	this.m__head=(c_HeadNode5.m_new.call(new c_HeadNode5));
}
c_List5.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List5.prototype.p_AddLast5=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<126>";
	var t_=c_Node8.m_new.call(new c_Node8,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List5.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<14>";
		this.p_AddLast5(t_t);
	}
	pop_err();
	return this;
}
c_List5.prototype.p_IsEmpty=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<50>";
	var t_=dbg_object(this.m__head).m__succ==this.m__head;
	pop_err();
	return t_;
}
c_List5.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<168>";
	var t_=c_Enumerator4.m_new.call(new c_Enumerator4,this);
	pop_err();
	return t_;
}
c_List5.prototype.p_AddFirst=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<122>";
	var t_=c_Node8.m_new.call(new c_Node8,dbg_object(this.m__head).m__succ,this.m__head,t_data);
	pop_err();
	return t_;
}
function c_Node8(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node8.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<243>";
	this.m__succ=t_succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<244>";
	this.m__pred=t_pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<245>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<246>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<247>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node8.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<240>";
	pop_err();
	return this;
}
function c_HeadNode5(){
	c_Node8.call(this);
}
c_HeadNode5.prototype=extend_class(c_Node8);
c_HeadNode5.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<292>";
	c_Node8.m_new2.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<293>";
	this.m__succ=(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<294>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_InvokeSuperExpr(){
	c_Expr.call(this);
	this.m_ident="";
	this.m_args=[];
	this.m_funcDecl=null;
}
c_InvokeSuperExpr.prototype=extend_class(c_Expr);
c_InvokeSuperExpr.m_new=function(t_ident,t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<460>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<461>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<462>";
	dbg_object(this).m_args=t_args;
	pop_err();
	return this;
}
c_InvokeSuperExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<453>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<453>";
	pop_err();
	return this;
}
c_InvokeSuperExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<470>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<470>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<472>";
	if(bb_decl__env.p_FuncScope().p_IsStatic()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<472>";
		bb_config_Err("Illegal use of Super.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<474>";
	var t_classScope=bb_decl__env.p_ClassScope();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<475>";
	var t_superClass=dbg_object(t_classScope).m_superClass;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<479>";
	if(!((t_superClass)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<479>";
		bb_config_Err("Class has no super class.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<481>";
	this.m_args=this.p_SemantArgs(this.m_args);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<482>";
	this.m_funcDecl=t_superClass.p_FindFuncDecl(this.m_ident,this.m_args,0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<483>";
	if(!((this.m_funcDecl)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<483>";
		bb_config_Err("Can't find superclass method '"+this.m_ident+"'.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<485>";
	if((this.m_funcDecl.p_IsAbstract())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<485>";
		bb_config_Err("Can't invoke abstract superclass method '"+this.m_ident+"'.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<487>";
	this.m_args=this.p_CastArgs(this.m_args,this.m_funcDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<488>";
	this.m_exprType=dbg_object(this.m_funcDecl).m_retType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<489>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_InvokeSuperExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<466>";
	var t_=(c_InvokeSuperExpr.m_new.call(new c_InvokeSuperExpr,this.m_ident,this.p_CopyArgs(this.m_args)));
	pop_err();
	return t_;
}
function c_IdentTypeExpr(){
	c_Expr.call(this);
	this.m_cdecl=null;
}
c_IdentTypeExpr.prototype=extend_class(c_Expr);
c_IdentTypeExpr.m_new=function(t_type){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<125>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<126>";
	dbg_object(this).m_exprType=t_type;
	pop_err();
	return this;
}
c_IdentTypeExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<122>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<122>";
	pop_err();
	return this;
}
c_IdentTypeExpr.prototype.p__Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<134>";
	if((this.m_cdecl)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<134>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<135>";
	this.m_exprType=this.m_exprType.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<136>";
	this.m_cdecl=this.m_exprType.p_GetClass();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<137>";
	if(!((this.m_cdecl)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<137>";
		bb_config_InternalErr("Internal error");
	}
	pop_err();
	return 0;
}
c_IdentTypeExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<141>";
	this.p__Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<142>";
	bb_config_Err("Expression can't be used in this way");
	pop_err();
	return null;
}
c_IdentTypeExpr.prototype.p_SemantScope=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<152>";
	this.p__Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<153>";
	var t_=(this.m_cdecl);
	pop_err();
	return t_;
}
c_IdentTypeExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<130>";
	var t_=(c_IdentTypeExpr.m_new.call(new c_IdentTypeExpr,this.m_exprType));
	pop_err();
	return t_;
}
c_IdentTypeExpr.prototype.p_SemantFunc=function(t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<146>";
	this.p__Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<147>";
	if(t_args.length==1 && ((dbg_array(t_args,0)[dbg_index])!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<147>";
		var t_=dbg_array(t_args,0)[dbg_index].p_Cast((dbg_object(this.m_cdecl).m_objectType),1);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<148>";
	bb_config_Err("Illegal number of arguments for type conversion");
	pop_err();
	return null;
}
function bb_config_Dequote(t_str,t_lang){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<138>";
	var t_=t_lang;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<139>";
	if(t_=="monkey"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<140>";
		if(t_str.length<2 || !string_startswith(t_str,"\"") || !string_endswith(t_str,"\"")){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<140>";
			bb_config_InternalErr("Internal error");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<141>";
		t_str=t_str.slice(1,-1);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<142>";
		var t_i=0;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<143>";
		do{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<144>";
			t_i=t_str.indexOf("~",t_i);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<145>";
			if(t_i==-1){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<145>";
				break;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<146>";
			if(t_i+1>=t_str.length){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<146>";
				bb_config_Err("Invalid escape sequence in string");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<147>";
			var t_ch=t_str.slice(t_i+1,t_i+2);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<148>";
			var t_2=t_ch;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<149>";
			if(t_2=="~"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<149>";
				t_ch="~";
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<150>";
				if(t_2=="q"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<150>";
					t_ch="\"";
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<151>";
					if(t_2=="n"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<151>";
						t_ch="\n";
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<152>";
						if(t_2=="r"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<152>";
							t_ch="\r";
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<153>";
							if(t_2=="t"){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<153>";
								t_ch="\t";
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<154>";
								if(t_2=="u"){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<155>";
									var t_t=t_str.slice(t_i+2,t_i+6);
									err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<156>";
									if(t_t.length!=4){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<156>";
										bb_config_Err("Invalid unicode hex value in string");
									}
									err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<157>";
									for(var t_j=0;t_j<4;t_j=t_j+1){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<158>";
										if(!((bb_config_IsHexDigit(t_t.charCodeAt(t_j)))!=0)){
											err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<158>";
											bb_config_Err("Invalid unicode hex digit in string");
										}
									}
									err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<160>";
									t_str=t_str.slice(0,t_i)+String.fromCharCode(bb_config_StringToInt(t_t,16))+t_str.slice(t_i+6);
									err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<161>";
									t_i+=1;
									err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<162>";
									continue;
								}else{
									err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<163>";
									if(t_2=="0"){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<163>";
										t_ch=String.fromCharCode(0);
									}else{
										err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<165>";
										bb_config_Err("Invalid escape character in string: '"+t_ch+"'");
									}
								}
							}
						}
					}
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<167>";
			t_str=t_str.slice(0,t_i)+t_ch+t_str.slice(t_i+2);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<168>";
			t_i+=t_ch.length;
		}while(!(false));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<170>";
		pop_err();
		return t_str;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<172>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return "";
}
function c_FuncCallExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_args=[];
}
c_FuncCallExpr.prototype=extend_class(c_Expr);
c_FuncCallExpr.m_new=function(t_expr,t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<317>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<318>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<319>";
	dbg_object(this).m_args=t_args;
	pop_err();
	return this;
}
c_FuncCallExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<313>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<313>";
	pop_err();
	return this;
}
c_FuncCallExpr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<327>";
	var t_t="FuncCallExpr("+this.m_expr.p_ToString();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<328>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<328>";
	var t_=this.m_args;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<328>";
	var t_2=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<328>";
	while(t_2<t_.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<328>";
		var t_arg=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<328>";
		t_2=t_2+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<329>";
		t_t=t_t+(","+t_arg.p_ToString());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<331>";
	var t_3=t_t+")";
	pop_err();
	return t_3;
}
c_FuncCallExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<336>";
	this.m_args=this.p_SemantArgs(this.m_args);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<337>";
	var t_=this.m_expr.p_SemantFunc(this.m_args);
	pop_err();
	return t_;
}
c_FuncCallExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<323>";
	var t_=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,this.p_CopyExpr(this.m_expr),this.p_CopyArgs(this.m_args)));
	pop_err();
	return t_;
}
function c_SliceExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_from=null;
	this.m_term=null;
}
c_SliceExpr.prototype=extend_class(c_Expr);
c_SliceExpr.m_new=function(t_expr,t_from,t_term){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1003>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1004>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1005>";
	dbg_object(this).m_from=t_from;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1006>";
	dbg_object(this).m_term=t_term;
	pop_err();
	return this;
}
c_SliceExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<998>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<998>";
	pop_err();
	return this;
}
c_SliceExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1014>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1014>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1016>";
	this.m_expr=this.m_expr.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1017>";
	if(((object_downcast((dbg_object(this.m_expr).m_exprType),c_ArrayType))!=null) || ((object_downcast((dbg_object(this.m_expr).m_exprType),c_StringType))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1018>";
		if((this.m_from)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1018>";
			this.m_from=this.m_from.p_Semant2((c_Type.m_intType),0);
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1019>";
		if((this.m_term)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1019>";
			this.m_term=this.m_term.p_Semant2((c_Type.m_intType),0);
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1020>";
		this.m_exprType=dbg_object(this.m_expr).m_exprType;
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1022>";
		bb_config_Err("Slices can only be used on strings or arrays.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1027>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_SliceExpr.prototype.p_Eval=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1031>";
	var t_from=parseInt((dbg_object(this).m_from.p_Eval()),10);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1032>";
	var t_term=parseInt((dbg_object(this).m_term.p_Eval()),10);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1033>";
	if((object_downcast((dbg_object(this.m_expr).m_exprType),c_StringType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1034>";
		var t_=this.m_expr.p_Eval().slice(t_from,t_term);
		pop_err();
		return t_;
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1035>";
		if((object_downcast((dbg_object(this.m_expr).m_exprType),c_ArrayType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1036>";
			bb_config_Err("TODO!");
		}
	}
	pop_err();
	return "";
}
c_SliceExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<1010>";
	var t_=(c_SliceExpr.m_new.call(new c_SliceExpr,this.p_CopyExpr(this.m_expr),this.p_CopyExpr(this.m_from),this.p_CopyExpr(this.m_term)));
	pop_err();
	return t_;
}
function c_IndexExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_index=null;
}
c_IndexExpr.prototype=extend_class(c_Expr);
c_IndexExpr.m_new=function(t_expr,t_index){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<940>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<941>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<942>";
	dbg_object(this).m_index=t_index;
	pop_err();
	return this;
}
c_IndexExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<936>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<936>";
	pop_err();
	return this;
}
c_IndexExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<954>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<954>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<956>";
	this.m_expr=this.m_expr.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<957>";
	this.m_index=this.m_index.p_Semant2((c_Type.m_intType),0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<959>";
	if((object_downcast((dbg_object(this.m_expr).m_exprType),c_StringType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<960>";
		this.m_exprType=(c_Type.m_intType);
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<961>";
		if((object_downcast((dbg_object(this.m_expr).m_exprType),c_ArrayType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<962>";
			this.m_exprType=dbg_object(object_downcast((dbg_object(this.m_expr).m_exprType),c_ArrayType)).m_elemType;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<964>";
			bb_config_Err("Only strings and arrays may be indexed.");
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<967>";
	if(((object_downcast((dbg_object(this.m_expr).m_exprType),c_StringType))!=null) && ((object_downcast((this.m_expr),c_ConstExpr))!=null) && ((object_downcast((this.m_index),c_ConstExpr))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<967>";
		var t_2=this.p_EvalConst();
		pop_err();
		return t_2;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<969>";
	var t_3=(this);
	pop_err();
	return t_3;
}
c_IndexExpr.prototype.p_Eval=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<973>";
	if((object_downcast((dbg_object(this.m_expr).m_exprType),c_StringType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<974>";
		var t_str=this.m_expr.p_Eval();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<975>";
		var t_idx=parseInt((this.m_index.p_Eval()),10);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<976>";
		if(t_idx<0 || t_idx>=t_str.length){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<976>";
			bb_config_Err("String index out of range.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<977>";
		var t_=String(t_str.charCodeAt(t_idx));
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<979>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return "";
}
c_IndexExpr.prototype.p_SemantSet=function(t_op,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<983>";
	this.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<984>";
	if((object_downcast((dbg_object(this.m_expr).m_exprType),c_StringType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<984>";
		bb_config_Err("Strings are read only.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<985>";
	var t_=(this);
	pop_err();
	return t_;
}
c_IndexExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<946>";
	var t_=(c_IndexExpr.m_new.call(new c_IndexExpr,this.p_CopyExpr(this.m_expr),this.p_CopyExpr(this.m_index)));
	pop_err();
	return t_;
}
c_IndexExpr.prototype.p_SideEffects=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<950>";
	var t_=bb_config_ENV_CONFIG=="debug";
	pop_err();
	return t_;
}
function c_BinaryExpr(){
	c_Expr.call(this);
	this.m_op="";
	this.m_lhs=null;
	this.m_rhs=null;
}
c_BinaryExpr.prototype=extend_class(c_Expr);
c_BinaryExpr.m_new=function(t_op,t_lhs,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<730>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<731>";
	dbg_object(this).m_op=t_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<732>";
	dbg_object(this).m_lhs=t_lhs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<733>";
	dbg_object(this).m_rhs=t_rhs;
	pop_err();
	return this;
}
c_BinaryExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<725>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<725>";
	pop_err();
	return this;
}
function c_BinaryMathExpr(){
	c_BinaryExpr.call(this);
}
c_BinaryMathExpr.prototype=extend_class(c_BinaryExpr);
c_BinaryMathExpr.m_new=function(t_op,t_lhs,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<745>";
	c_BinaryExpr.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<746>";
	dbg_object(this).m_op=t_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<747>";
	dbg_object(this).m_lhs=t_lhs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<748>";
	dbg_object(this).m_rhs=t_rhs;
	pop_err();
	return this;
}
c_BinaryMathExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<743>";
	c_BinaryExpr.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<743>";
	pop_err();
	return this;
}
c_BinaryMathExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<756>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<756>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<758>";
	this.m_lhs=this.m_lhs.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<759>";
	this.m_rhs=this.m_rhs.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<761>";
	var t_2=this.m_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<762>";
	if(t_2=="&" || t_2=="~" || t_2=="|" || t_2=="shl" || t_2=="shr"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<763>";
		this.m_exprType=(c_Type.m_intType);
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<765>";
		this.m_exprType=this.p_BalanceTypes(dbg_object(this.m_lhs).m_exprType,dbg_object(this.m_rhs).m_exprType);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<766>";
		if((object_downcast((this.m_exprType),c_StringType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<767>";
			if(this.m_op!="+"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<768>";
				bb_config_Err("Illegal string operator.");
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<770>";
			if(!((object_downcast((this.m_exprType),c_NumericType))!=null)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<771>";
				bb_config_Err("Illegal expression type.");
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<775>";
	this.m_lhs=this.m_lhs.p_Cast(this.m_exprType,0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<776>";
	this.m_rhs=this.m_rhs.p_Cast(this.m_exprType,0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<778>";
	if(((object_downcast((this.m_lhs),c_ConstExpr))!=null) && ((object_downcast((this.m_rhs),c_ConstExpr))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<778>";
		var t_3=this.p_EvalConst();
		pop_err();
		return t_3;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<780>";
	var t_4=(this);
	pop_err();
	return t_4;
}
c_BinaryMathExpr.prototype.p_Eval=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<784>";
	var t_lhs=dbg_object(this).m_lhs.p_Eval();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<785>";
	var t_rhs=dbg_object(this).m_rhs.p_Eval();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<786>";
	if((object_downcast((this.m_exprType),c_IntType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<787>";
		var t_x=parseInt((t_lhs),10);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<787>";
		var t_y=parseInt((t_rhs),10);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<788>";
		var t_=this.m_op;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<789>";
		if(t_=="/"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<790>";
			if(!((t_y)!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<790>";
				bb_config_Err("Divide by zero error.");
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<791>";
			var t_2=String((t_x/t_y)|0);
			pop_err();
			return t_2;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<792>";
			if(t_=="*"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<792>";
				var t_3=String(t_x*t_y);
				pop_err();
				return t_3;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<793>";
				if(t_=="mod"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<794>";
					if(!((t_y)!=0)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<794>";
						bb_config_Err("Divide by zero error.");
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<795>";
					var t_4=String(t_x % t_y);
					pop_err();
					return t_4;
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<796>";
					if(t_=="shl"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<796>";
						var t_5=String(t_x<<t_y);
						pop_err();
						return t_5;
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<797>";
						if(t_=="shr"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<797>";
							var t_6=String(t_x>>t_y);
							pop_err();
							return t_6;
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<798>";
							if(t_=="+"){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<798>";
								var t_7=String(t_x+t_y);
								pop_err();
								return t_7;
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<799>";
								if(t_=="-"){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<799>";
									var t_8=String(t_x-t_y);
									pop_err();
									return t_8;
								}else{
									err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<800>";
									if(t_=="&"){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<800>";
										var t_9=String(t_x&t_y);
										pop_err();
										return t_9;
									}else{
										err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<801>";
										if(t_=="~"){
											err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<801>";
											var t_10=String(t_x^t_y);
											pop_err();
											return t_10;
										}else{
											err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<802>";
											if(t_=="|"){
												err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<802>";
												var t_11=String(t_x|t_y);
												pop_err();
												return t_11;
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<804>";
		if((object_downcast((this.m_exprType),c_FloatType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<805>";
			var t_x2=parseFloat(t_lhs);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<805>";
			var t_y2=parseFloat(t_rhs);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<806>";
			var t_12=this.m_op;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<807>";
			if(t_12=="/"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<808>";
				if(!((t_y2)!=0.0)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<808>";
					bb_config_Err("Divide by zero error.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<809>";
				var t_13=String(t_x2/t_y2);
				pop_err();
				return t_13;
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<810>";
				if(t_12=="*"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<810>";
					var t_14=String(t_x2*t_y2);
					pop_err();
					return t_14;
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<811>";
					if(t_12=="+"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<811>";
						var t_15=String(t_x2+t_y2);
						pop_err();
						return t_15;
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<812>";
						if(t_12=="-"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<812>";
							var t_16=String(t_x2-t_y2);
							pop_err();
							return t_16;
						}
					}
				}
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<814>";
			if((object_downcast((this.m_exprType),c_StringType))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<815>";
				var t_17=this.m_op;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<816>";
				if(t_17=="+"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<816>";
					var t_18=t_lhs+t_rhs;
					pop_err();
					return t_18;
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<819>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return "";
}
c_BinaryMathExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<752>";
	var t_=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,this.m_op,this.p_CopyExpr(this.m_lhs),this.p_CopyExpr(this.m_rhs)));
	pop_err();
	return t_;
}
function c_BinaryCompareExpr(){
	c_BinaryExpr.call(this);
	this.m_ty=null;
}
c_BinaryCompareExpr.prototype=extend_class(c_BinaryExpr);
c_BinaryCompareExpr.m_new=function(t_op,t_lhs,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<828>";
	c_BinaryExpr.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<829>";
	dbg_object(this).m_op=t_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<830>";
	dbg_object(this).m_lhs=t_lhs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<831>";
	dbg_object(this).m_rhs=t_rhs;
	pop_err();
	return this;
}
c_BinaryCompareExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<825>";
	c_BinaryExpr.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<825>";
	pop_err();
	return this;
}
c_BinaryCompareExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<839>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<839>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<841>";
	this.m_lhs=this.m_lhs.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<842>";
	this.m_rhs=this.m_rhs.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<844>";
	this.m_ty=this.p_BalanceTypes(dbg_object(this.m_lhs).m_exprType,dbg_object(this.m_rhs).m_exprType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<846>";
	if((object_downcast((this.m_ty),c_ArrayType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<846>";
		bb_config_Err("Arrays cannot be compared.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<847>";
	if(((object_downcast((this.m_ty),c_ObjectType))!=null) && this.m_op!="=" && this.m_op!="<>"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<847>";
		bb_config_Err("Objects can only be compared for equality.");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<849>";
	this.m_lhs=this.m_lhs.p_Cast(this.m_ty,0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<850>";
	this.m_rhs=this.m_rhs.p_Cast(this.m_ty,0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<852>";
	this.m_exprType=(c_Type.m_boolType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<854>";
	if(((object_downcast((this.m_lhs),c_ConstExpr))!=null) && ((object_downcast((this.m_rhs),c_ConstExpr))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<854>";
		var t_2=this.p_EvalConst();
		pop_err();
		return t_2;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<856>";
	var t_3=(this);
	pop_err();
	return t_3;
}
c_BinaryCompareExpr.prototype.p_Eval=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<860>";
	var t_r=-1;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<861>";
	if((object_downcast((this.m_ty),c_IntType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<862>";
		var t_lhs=parseInt((dbg_object(this).m_lhs.p_Eval()),10);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<863>";
		var t_rhs=parseInt((dbg_object(this).m_rhs.p_Eval()),10);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<864>";
		var t_=this.m_op;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<865>";
		if(t_=="="){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<865>";
			t_r=((t_lhs==t_rhs)?1:0);
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<866>";
			if(t_=="<>"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<866>";
				t_r=((t_lhs!=t_rhs)?1:0);
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<867>";
				if(t_=="<"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<867>";
					t_r=((t_lhs<t_rhs)?1:0);
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<868>";
					if(t_=="<="){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<868>";
						t_r=((t_lhs<=t_rhs)?1:0);
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<869>";
						if(t_==">"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<869>";
							t_r=((t_lhs>t_rhs)?1:0);
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<870>";
							if(t_==">="){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<870>";
								t_r=((t_lhs>=t_rhs)?1:0);
							}
						}
					}
				}
			}
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<872>";
		if((object_downcast((this.m_ty),c_FloatType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<873>";
			var t_lhs2=parseFloat(dbg_object(this).m_lhs.p_Eval());
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<874>";
			var t_rhs2=parseFloat(dbg_object(this).m_rhs.p_Eval());
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<875>";
			var t_2=this.m_op;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<876>";
			if(t_2=="="){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<876>";
				t_r=((t_lhs2==t_rhs2)?1:0);
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<877>";
				if(t_2=="<>"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<877>";
					t_r=((t_lhs2!=t_rhs2)?1:0);
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<878>";
					if(t_2=="<"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<878>";
						t_r=((t_lhs2<t_rhs2)?1:0);
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<879>";
						if(t_2=="<="){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<879>";
							t_r=((t_lhs2<=t_rhs2)?1:0);
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<880>";
							if(t_2==">"){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<880>";
								t_r=((t_lhs2>t_rhs2)?1:0);
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<881>";
								if(t_2==">="){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<881>";
									t_r=((t_lhs2>=t_rhs2)?1:0);
								}
							}
						}
					}
				}
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<883>";
			if((object_downcast((this.m_ty),c_StringType))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<884>";
				var t_lhs3=dbg_object(this).m_lhs.p_Eval();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<885>";
				var t_rhs3=dbg_object(this).m_rhs.p_Eval();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<886>";
				var t_3=this.m_op;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<887>";
				if(t_3=="="){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<887>";
					t_r=((t_lhs3==t_rhs3)?1:0);
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<888>";
					if(t_3=="<>"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<888>";
						t_r=((t_lhs3!=t_rhs3)?1:0);
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<889>";
						if(t_3=="<"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<889>";
							t_r=((t_lhs3<t_rhs3)?1:0);
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<890>";
							if(t_3=="<="){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<890>";
								t_r=((t_lhs3<=t_rhs3)?1:0);
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<891>";
								if(t_3==">"){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<891>";
									t_r=((t_lhs3>t_rhs3)?1:0);
								}else{
									err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<892>";
									if(t_3==">="){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<892>";
										t_r=((t_lhs3>=t_rhs3)?1:0);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<895>";
	if(t_r==1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<895>";
		pop_err();
		return "1";
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<896>";
	if(t_r==0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<896>";
		pop_err();
		return "";
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<897>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return "";
}
c_BinaryCompareExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<835>";
	var t_=(c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,this.m_op,this.p_CopyExpr(this.m_lhs),this.p_CopyExpr(this.m_rhs)));
	pop_err();
	return t_;
}
function c_BinaryLogicExpr(){
	c_BinaryExpr.call(this);
}
c_BinaryLogicExpr.prototype=extend_class(c_BinaryExpr);
c_BinaryLogicExpr.m_new=function(t_op,t_lhs,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<904>";
	c_BinaryExpr.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<905>";
	dbg_object(this).m_op=t_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<906>";
	dbg_object(this).m_lhs=t_lhs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<907>";
	dbg_object(this).m_rhs=t_rhs;
	pop_err();
	return this;
}
c_BinaryLogicExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<902>";
	c_BinaryExpr.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<902>";
	pop_err();
	return this;
}
c_BinaryLogicExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<915>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<915>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<917>";
	this.m_lhs=this.m_lhs.p_Semant2((c_Type.m_boolType),1);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<918>";
	this.m_rhs=this.m_rhs.p_Semant2((c_Type.m_boolType),1);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<920>";
	this.m_exprType=(c_Type.m_boolType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<922>";
	if(((object_downcast((this.m_lhs),c_ConstExpr))!=null) && ((object_downcast((this.m_rhs),c_ConstExpr))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<922>";
		var t_2=this.p_EvalConst();
		pop_err();
		return t_2;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<924>";
	var t_3=(this);
	pop_err();
	return t_3;
}
c_BinaryLogicExpr.prototype.p_Eval=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<928>";
	var t_=this.m_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<929>";
	if(t_=="and"){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<929>";
		if(((this.m_lhs.p_Eval()).length!=0) && ((this.m_rhs.p_Eval()).length!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<929>";
			pop_err();
			return "1";
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<929>";
			pop_err();
			return "";
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<930>";
		if(t_=="or"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<930>";
			if(((this.m_lhs.p_Eval()).length!=0) || ((this.m_rhs.p_Eval()).length!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<930>";
				pop_err();
				return "1";
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<930>";
				pop_err();
				return "";
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<932>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return "";
}
c_BinaryLogicExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<911>";
	var t_=(c_BinaryLogicExpr.m_new.call(new c_BinaryLogicExpr,this.m_op,this.p_CopyExpr(this.m_lhs),this.p_CopyExpr(this.m_rhs)));
	pop_err();
	return t_;
}
function c_ObjectType(){
	c_Type.call(this);
	this.m_classDecl=null;
}
c_ObjectType.prototype=extend_class(c_Type);
c_ObjectType.m_new=function(t_classDecl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<202>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<203>";
	dbg_object(this).m_classDecl=t_classDecl;
	pop_err();
	return this;
}
c_ObjectType.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<199>";
	c_Type.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<199>";
	pop_err();
	return this;
}
c_ObjectType.prototype.p_EqualsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<207>";
	var t_objty=object_downcast((t_ty),c_ObjectType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<208>";
	var t_=((((t_objty)!=null) && this.m_classDecl==dbg_object(t_objty).m_classDecl)?1:0);
	pop_err();
	return t_;
}
c_ObjectType.prototype.p_GetClass=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<231>";
	pop_err();
	return this.m_classDecl;
}
c_ObjectType.prototype.p_ExtendsType=function(t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<212>";
	var t_objty=object_downcast((t_ty),c_ObjectType);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<213>";
	if((t_objty)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<213>";
		var t_=this.m_classDecl.p_ExtendsClass(dbg_object(t_objty).m_classDecl);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<214>";
	var t_op="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<215>";
	if((object_downcast((t_ty),c_BoolType))!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<216>";
		t_op="ToBool";
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<217>";
		if((object_downcast((t_ty),c_IntType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<218>";
			t_op="ToInt";
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<219>";
			if((object_downcast((t_ty),c_FloatType))!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<220>";
				t_op="ToFloat";
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<221>";
				if((object_downcast((t_ty),c_StringType))!=null){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<222>";
					t_op="ToString";
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<224>";
					pop_err();
					return 0;
				}
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<226>";
	var t_fdecl=this.p_GetClass().p_FindFuncDecl(t_op,[],1);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<227>";
	var t_2=((((t_fdecl)!=null) && t_fdecl.p_IsMethod() && ((dbg_object(t_fdecl).m_retType.p_EqualsType(t_ty))!=0))?1:0);
	pop_err();
	return t_2;
}
c_ObjectType.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/type.monkey<235>";
	var t_=this.m_classDecl.p_ToString();
	pop_err();
	return t_;
}
function c_ClassDecl(){
	c_ScopeDecl.call(this);
	this.m_args=[];
	this.m_instanceof=null;
	this.m_instArgs=[];
	this.m_implmentsAll=[];
	this.m_superTy=null;
	this.m_impltys=[];
	this.m_objectType=null;
	this.m_instances=null;
	this.m_superClass=null;
	this.m_implments=[];
}
c_ClassDecl.prototype=extend_class(c_ScopeDecl);
c_ClassDecl.prototype.p_IsInterface=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<888>";
	var t_=(((this.m_attrs&4096)!=0)?1:0);
	pop_err();
	return t_;
}
c_ClassDecl.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<824>";
	var t_t="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<825>";
	if((this.m_args).length!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<826>";
		t_t=this.m_args.join(",");
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<827>";
		if((this.m_instArgs).length!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<828>";
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<828>";
			var t_=this.m_instArgs;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<828>";
			var t_2=0;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<828>";
			while(t_2<t_.length){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<828>";
				var t_arg=dbg_array(t_,t_2)[dbg_index];
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<828>";
				t_2=t_2+1;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<829>";
				if((t_t).length!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<829>";
					t_t=t_t+",";
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<830>";
				t_t=t_t+t_arg.p_ToString();
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<833>";
	if((t_t).length!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<833>";
		t_t="<"+t_t+">";
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<834>";
	var t_3=this.m_ident+t_t;
	pop_err();
	return t_3;
}
c_ClassDecl.prototype.p_FindFuncDecl2=function(t_ident,t_args,t_explicit){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<959>";
	var t_=c_ScopeDecl.prototype.p_FindFuncDecl.call(this,t_ident,t_args,t_explicit);
	pop_err();
	return t_;
}
c_ClassDecl.prototype.p_FindFuncDecl=function(t_ident,t_args,t_explicit){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<923>";
	if(!((this.p_IsInterface())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<924>";
		var t_=this.p_FindFuncDecl2(t_ident,t_args,t_explicit);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<927>";
	var t_fdecl=this.p_FindFuncDecl2(t_ident,t_args,1);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<929>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<929>";
	var t_2=this.m_implmentsAll;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<929>";
	var t_3=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<929>";
	while(t_3<t_2.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<929>";
		var t_iface=dbg_array(t_2,t_3)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<929>";
		t_3=t_3+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<930>";
		var t_decl=t_iface.p_FindFuncDecl2(t_ident,t_args,1);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<931>";
		if(!((t_decl)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<931>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<933>";
		if((t_fdecl)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<934>";
			if(t_fdecl.p_EqualsFunc(t_decl)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<934>";
				continue;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<935>";
			bb_config_Err("Unable to determine overload to use: "+t_fdecl.p_ToString()+" or "+t_decl.p_ToString()+".");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<937>";
		t_fdecl=t_decl;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<940>";
	if(((t_fdecl)!=null) || ((t_explicit)!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<940>";
		pop_err();
		return t_fdecl;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<942>";
	t_fdecl=this.p_FindFuncDecl2(t_ident,t_args,0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<944>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<944>";
	var t_4=this.m_implmentsAll;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<944>";
	var t_5=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<944>";
	while(t_5<t_4.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<944>";
		var t_iface2=dbg_array(t_4,t_5)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<944>";
		t_5=t_5+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<945>";
		var t_decl2=t_iface2.p_FindFuncDecl2(t_ident,t_args,0);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<946>";
		if(!((t_decl2)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<946>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<948>";
		if((t_fdecl)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<949>";
			if(t_fdecl.p_EqualsFunc(t_decl2)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<949>";
				continue;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<950>";
			bb_config_Err("Unable to determine overload to use: "+t_fdecl.p_ToString()+" or "+t_decl2.p_ToString()+".");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<952>";
		t_fdecl=t_decl2;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<955>";
	pop_err();
	return t_fdecl;
}
c_ClassDecl.m_new=function(t_ident,t_attrs,t_args,t_superTy,t_impls){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<809>";
	c_ScopeDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<810>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<811>";
	dbg_object(this).m_attrs=t_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<812>";
	dbg_object(this).m_args=t_args;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<813>";
	dbg_object(this).m_superTy=t_superTy;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<814>";
	dbg_object(this).m_impltys=t_impls;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<815>";
	dbg_object(this).m_objectType=c_ObjectType.m_new.call(new c_ObjectType,this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<816>";
	if((t_args).length!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<816>";
		this.m_instances=c_List7.m_new.call(new c_List7);
	}
	pop_err();
	return this;
}
c_ClassDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<790>";
	c_ScopeDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<790>";
	pop_err();
	return this;
}
c_ClassDecl.prototype.p_IsFinalized=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<896>";
	var t_=(((this.m_attrs&4)!=0)?1:0);
	pop_err();
	return t_;
}
c_ClassDecl.prototype.p_UpdateLiveMethods=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1073>";
	if((this.p_IsFinalized())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1073>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1075>";
	if((this.p_IsInterface())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1075>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1077>";
	if(!((this.m_superClass)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1077>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1079>";
	var t_n=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1080>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1080>";
	var t_=this.p_MethodDecls("").p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1080>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1080>";
		var t_decl=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1081>";
		if((t_decl.p_IsSemanted())!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1081>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1083>";
		var t_live=0;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1084>";
		var t_unsem=c_List3.m_new.call(new c_List3);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1086>";
		t_unsem.p_AddLast3(t_decl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1088>";
		var t_sclass=this.m_superClass;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1089>";
		while((t_sclass)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1090>";
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1090>";
			var t_2=t_sclass.p_MethodDecls(dbg_object(t_decl).m_ident).p_ObjectEnumerator();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1090>";
			while(t_2.p_HasNext()){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1090>";
				var t_decl2=t_2.p_NextObject();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1091>";
				if((t_decl2.p_IsSemanted())!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1092>";
					t_live=1;
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1094>";
					t_unsem.p_AddLast3(t_decl2);
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1095>";
					if((t_decl2.p_IsExtern())!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1095>";
						t_live=1;
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1096>";
					if((t_decl2.p_IsSemanted())!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1096>";
						t_live=1;
					}
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1099>";
			t_sclass=dbg_object(t_sclass).m_superClass;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1102>";
		if(!((t_live)!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1103>";
			var t_cdecl=this;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1104>";
			while((t_cdecl)!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1105>";
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1105>";
				var t_3=dbg_object(t_cdecl).m_implmentsAll;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1105>";
				var t_4=0;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1105>";
				while(t_4<t_3.length){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1105>";
					var t_iface=dbg_array(t_3,t_4)[dbg_index];
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1105>";
					t_4=t_4+1;
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1106>";
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1106>";
					var t_5=t_iface.p_MethodDecls(dbg_object(t_decl).m_ident).p_ObjectEnumerator();
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1106>";
					while(t_5.p_HasNext()){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1106>";
						var t_decl22=t_5.p_NextObject();
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1107>";
						if((t_decl22.p_IsSemanted())!=0){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1108>";
							t_live=1;
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1110>";
							t_unsem.p_AddLast3(t_decl22);
							err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1111>";
							if((t_decl22.p_IsExtern())!=0){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1111>";
								t_live=1;
							}
							err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1112>";
							if((t_decl22.p_IsSemanted())!=0){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1112>";
								t_live=1;
							}
						}
					}
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1116>";
				t_cdecl=dbg_object(t_cdecl).m_superClass;
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1120>";
		if(!((t_live)!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1120>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1122>";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1122>";
		var t_6=t_unsem.p_ObjectEnumerator();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1122>";
		while(t_6.p_HasNext()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1122>";
			var t_decl3=t_6.p_NextObject();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1123>";
			t_decl3.p_Semant();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1124>";
			t_n+=1;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1128>";
	pop_err();
	return t_n;
}
c_ClassDecl.prototype.p_IsInstanced=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<892>";
	var t_=(((this.m_attrs&1)!=0)?1:0);
	pop_err();
	return t_;
}
c_ClassDecl.prototype.p_FinalizeClass=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1133>";
	if((this.p_IsFinalized())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1133>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1135>";
	this.m_attrs|=4;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1137>";
	if((this.p_IsInterface())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1137>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1139>";
	bb_config_PushErr(this.m_errInfo);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1143>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1143>";
	var t_=this.p_Semanted().p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1143>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1143>";
		var t_decl=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1144>";
		var t_fdecl=object_downcast((t_decl),c_FieldDecl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1145>";
		if(!((t_fdecl)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1145>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1146>";
		var t_cdecl=this.m_superClass;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1147>";
		while((t_cdecl)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1148>";
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1148>";
			var t_2=t_cdecl.p_Semanted().p_ObjectEnumerator();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1148>";
			while(t_2.p_HasNext()){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1148>";
				var t_decl2=t_2.p_NextObject();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1149>";
				if(dbg_object(t_decl2).m_ident==dbg_object(t_fdecl).m_ident){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1150>";
					bb_config__errInfo=dbg_object(t_fdecl).m_errInfo;
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1151>";
					bb_config_Err("Field '"+dbg_object(t_fdecl).m_ident+"' in class "+this.p_ToString()+" overrides existing declaration in class "+t_cdecl.p_ToString());
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1154>";
			t_cdecl=dbg_object(t_cdecl).m_superClass;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1160>";
	if((this.p_IsAbstract())!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1161>";
		if((this.p_IsInstanced())!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1162>";
			bb_config_Err("Can't create instance of abstract class "+this.p_ToString()+".");
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1165>";
		var t_cdecl2=this;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1166>";
		var t_impls=c_List3.m_new.call(new c_List3);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1167>";
		while(((t_cdecl2)!=null) && !((this.p_IsAbstract())!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1168>";
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1168>";
			var t_3=t_cdecl2.p_SemantedMethods("").p_ObjectEnumerator();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1168>";
			while(t_3.p_HasNext()){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1168>";
				var t_decl3=t_3.p_NextObject();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1169>";
				if((t_decl3.p_IsAbstract())!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1170>";
					var t_found=0;
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1171>";
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1171>";
					var t_4=t_impls.p_ObjectEnumerator();
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1171>";
					while(t_4.p_HasNext()){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1171>";
						var t_decl22=t_4.p_NextObject();
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1172>";
						if(dbg_object(t_decl3).m_ident==dbg_object(t_decl22).m_ident && t_decl3.p_EqualsFunc(t_decl22)){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1173>";
							t_found=1;
							err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1174>";
							break;
						}
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1177>";
					if(!((t_found)!=0)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1178>";
						if((this.p_IsInstanced())!=0){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1179>";
							bb_config_Err("Can't create instance of class "+this.p_ToString()+" due to abstract method "+t_decl3.p_ToString()+".");
						}
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1181>";
						this.m_attrs|=1024;
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1182>";
						break;
					}
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1185>";
					t_impls.p_AddLast3(t_decl3);
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1188>";
			t_cdecl2=dbg_object(t_cdecl2).m_superClass;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1194>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1194>";
	var t_5=this.m_implmentsAll;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1194>";
	var t_6=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1194>";
	while(t_6<t_5.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1194>";
		var t_iface=dbg_array(t_5,t_6)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1194>";
		t_6=t_6+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1195>";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1195>";
		var t_7=t_iface.p_SemantedMethods("").p_ObjectEnumerator();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1195>";
		while(t_7.p_HasNext()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1195>";
			var t_decl4=t_7.p_NextObject();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1196>";
			var t_found2=0;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1197>";
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1197>";
			var t_8=this.p_SemantedMethods(dbg_object(t_decl4).m_ident).p_ObjectEnumerator();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1197>";
			while(t_8.p_HasNext()){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1197>";
				var t_decl23=t_8.p_NextObject();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1198>";
				if(t_decl4.p_EqualsFunc(t_decl23)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1199>";
					if((dbg_object(t_decl23).m_munged).length!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1200>";
						bb_config_Err("Extern methods cannot be used to implement interface methods.");
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1202>";
					t_found2=1;
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1205>";
			if(!((t_found2)!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1206>";
				bb_config_Err(t_decl4.p_ToString()+" must be implemented by class "+this.p_ToString());
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1211>";
	bb_config_PopErr();
	pop_err();
	return 0;
}
c_ClassDecl.m_nullObjectClass=null;
c_ClassDecl.prototype.p_GenClassInstance=function(t_instArgs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<839>";
	if((this.m_instanceof)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<839>";
		bb_config_InternalErr("Internal error");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<842>";
	if(!((t_instArgs).length!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<843>";
		if(!((this.m_args).length!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<843>";
			pop_err();
			return this;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<844>";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<844>";
		var t_=this.m_instances.p_ObjectEnumerator();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<844>";
		while(t_.p_HasNext()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<844>";
			var t_inst=t_.p_NextObject();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<845>";
			if(bb_decl__env.p_ClassScope()==t_inst){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<845>";
				pop_err();
				return t_inst;
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<850>";
	if(this.m_args.length!=t_instArgs.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<851>";
		bb_config_Err("Wrong number of type arguments for class "+this.p_ToString());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<855>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<855>";
	var t_2=this.m_instances.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<855>";
	while(t_2.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<855>";
		var t_inst2=t_2.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<856>";
		var t_equal=1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<857>";
		for(var t_i=0;t_i<this.m_args.length;t_i=t_i+1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<858>";
			if(!((dbg_array(dbg_object(t_inst2).m_instArgs,t_i)[dbg_index].p_EqualsType(dbg_array(t_instArgs,t_i)[dbg_index]))!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<859>";
				t_equal=0;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<860>";
				break;
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<863>";
		if((t_equal)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<863>";
			pop_err();
			return t_inst2;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<866>";
	var t_inst3=c_ClassDecl.m_new.call(new c_ClassDecl,this.m_ident,this.m_attrs,[],this.m_superTy,this.m_impltys);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<868>";
	dbg_object(t_inst3).m_attrs&=-1048577;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<869>";
	dbg_object(t_inst3).m_munged=this.m_munged;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<870>";
	dbg_object(t_inst3).m_errInfo=this.m_errInfo;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<871>";
	dbg_object(t_inst3).m_scope=this.m_scope;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<872>";
	dbg_object(t_inst3).m_instanceof=this;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<873>";
	dbg_object(t_inst3).m_instArgs=t_instArgs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<874>";
	this.m_instances.p_AddLast7(t_inst3);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<876>";
	for(var t_i2=0;t_i2<this.m_args.length;t_i2=t_i2+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<877>";
		t_inst3.p_InsertDecl(c_AliasDecl.m_new.call(new c_AliasDecl,dbg_array(this.m_args,t_i2)[dbg_index],0,(dbg_array(t_instArgs,t_i2)[dbg_index])));
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<880>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<880>";
	var t_3=this.m_decls.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<880>";
	while(t_3.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<880>";
		var t_decl=t_3.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<881>";
		t_inst3.p_InsertDecl(t_decl.p_Copy());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<884>";
	pop_err();
	return t_inst3;
}
c_ClassDecl.prototype.p_ExtendsClass=function(t_cdecl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<963>";
	if(this==c_ClassDecl.m_nullObjectClass){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<963>";
		pop_err();
		return 1;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<965>";
	var t_tdecl=this;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<966>";
	while((t_tdecl)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<967>";
		if(t_tdecl==t_cdecl){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<967>";
			pop_err();
			return 1;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<968>";
		if((t_cdecl.p_IsInterface())!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<969>";
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<969>";
			var t_=dbg_object(t_tdecl).m_implmentsAll;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<969>";
			var t_2=0;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<969>";
			while(t_2<t_.length){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<969>";
				var t_iface=dbg_array(t_,t_2)[dbg_index];
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<969>";
				t_2=t_2+1;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<970>";
				if(t_iface==t_cdecl){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<970>";
					pop_err();
					return 1;
				}
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<973>";
		t_tdecl=dbg_object(t_tdecl).m_superClass;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<976>";
	pop_err();
	return 0;
}
c_ClassDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<820>";
	bb_config_InternalErr("Internal error");
	pop_err();
	return null;
}
c_ClassDecl.prototype.p_GetDecl2=function(t_ident){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<918>";
	var t_=c_ScopeDecl.prototype.p_GetDecl.call(this,t_ident);
	pop_err();
	return t_;
}
c_ClassDecl.prototype.p_GetDecl=function(t_ident){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<908>";
	var t_cdecl=this;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<909>";
	while((t_cdecl)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<910>";
		var t_decl=t_cdecl.p_GetDecl2(t_ident);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<911>";
		if((t_decl)!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<911>";
			pop_err();
			return t_decl;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<912>";
		t_cdecl=dbg_object(t_cdecl).m_superClass;
	}
	pop_err();
	return null;
}
c_ClassDecl.prototype.p_IsThrowable=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<900>";
	var t_=(((this.m_attrs&8192)!=0)?1:0);
	pop_err();
	return t_;
}
c_ClassDecl.prototype.p_ExtendsObject=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<904>";
	var t_=(((this.m_attrs&2)!=0)?1:0);
	pop_err();
	return t_;
}
c_ClassDecl.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<981>";
	if((this.m_args).length!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<981>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<983>";
	bb_decl_PushEnv(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<986>";
	if((this.m_superTy)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<987>";
		this.m_superClass=this.m_superTy.p_SemantClass();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<988>";
		if((this.m_superClass.p_IsFinal())!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<988>";
			bb_config_Err("Cannot extend final class.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<989>";
		if((this.m_superClass.p_IsInterface())!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<989>";
			bb_config_Err("Cannot extend an interface.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<990>";
		if(this.m_munged=="ThrowableObject" || ((this.m_superClass.p_IsThrowable())!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<990>";
			this.m_attrs|=8192;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<991>";
		if((this.m_superClass.p_ExtendsObject())!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<991>";
			this.m_attrs|=2;
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<993>";
		if(this.m_munged=="Object"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<993>";
			this.m_attrs|=2;
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<997>";
	var t_impls=new_object_array(this.m_impltys.length);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<998>";
	var t_implsall=c_Stack7.m_new.call(new c_Stack7);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<999>";
	for(var t_i=0;t_i<this.m_impltys.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1000>";
		var t_cdecl=dbg_array(this.m_impltys,t_i)[dbg_index].p_SemantClass();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1001>";
		if(!((t_cdecl.p_IsInterface())!=0)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1002>";
			bb_config_Err(t_cdecl.p_ToString()+" is a class, not an interface.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1004>";
		for(var t_j=0;t_j<t_i;t_j=t_j+1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1005>";
			if(dbg_array(t_impls,t_j)[dbg_index]==t_cdecl){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1006>";
				bb_config_Err("Duplicate interface "+t_cdecl.p_ToString()+".");
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1009>";
		dbg_array(t_impls,t_i)[dbg_index]=t_cdecl
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1010>";
		t_implsall.p_Push19(t_cdecl);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1011>";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1011>";
		var t_=dbg_object(t_cdecl).m_implmentsAll;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1011>";
		var t_2=0;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1011>";
		while(t_2<t_.length){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1011>";
			var t_tdecl=dbg_array(t_,t_2)[dbg_index];
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1011>";
			t_2=t_2+1;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1012>";
			t_implsall.p_Push19(t_tdecl);
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1015>";
	this.m_implmentsAll=new_object_array(t_implsall.p_Length());
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1016>";
	for(var t_i2=0;t_i2<t_implsall.p_Length();t_i2=t_i2+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1017>";
		dbg_array(this.m_implmentsAll,t_i2)[dbg_index]=t_implsall.p_Get2(t_i2)
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1019>";
	this.m_implments=t_impls;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1034>";
	bb_decl_PopEnv();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1037>";
	if(!((this.p_IsAbstract())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1038>";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1038>";
		var t_3=this.m_decls.p_ObjectEnumerator();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1038>";
		while(t_3.p_HasNext()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1038>";
			var t_decl=t_3.p_NextObject();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1039>";
			var t_fdecl=object_downcast((t_decl),c_FuncDecl);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1040>";
			if(((t_fdecl)!=null) && ((t_fdecl.p_IsAbstract())!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1041>";
				this.m_attrs|=1024;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1042>";
				break;
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1047>";
	if(!((this.p_IsExtern())!=0) && !((this.p_IsInterface())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1048>";
		var t_fdecl2=null;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1049>";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1049>";
		var t_4=this.p_FuncDecls("").p_ObjectEnumerator();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1049>";
		while(t_4.p_HasNext()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1049>";
			var t_decl2=t_4.p_NextObject();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1050>";
			if(!t_decl2.p_IsCtor()){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1050>";
				continue;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1051>";
			var t_nargs=0;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1052>";
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1052>";
			var t_5=dbg_object(t_decl2).m_argDecls;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1052>";
			var t_6=0;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1052>";
			while(t_6<t_5.length){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1052>";
				var t_arg=dbg_array(t_5,t_6)[dbg_index];
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1052>";
				t_6=t_6+1;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1053>";
				if(!((dbg_object(t_arg).m_init)!=null)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1053>";
					t_nargs+=1;
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1055>";
			if((t_nargs)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1055>";
				continue;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1056>";
			t_fdecl2=t_decl2;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1057>";
			break;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1059>";
		if(!((t_fdecl2)!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1060>";
			t_fdecl2=c_FuncDecl.m_new.call(new c_FuncDecl,"new",2,(this.m_objectType),[]);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1061>";
			t_fdecl2.p_AddStmt(c_ReturnStmt.m_new.call(new c_ReturnStmt,null));
			err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1062>";
			this.p_InsertDecl(t_fdecl2);
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<1067>";
	dbg_object(this.p_AppScope()).m_semantedClasses.p_AddLast7(this);
	pop_err();
	return 0;
}
function c_AliasDecl(){
	c_Decl.call(this);
	this.m_decl=null;
}
c_AliasDecl.prototype=extend_class(c_Decl);
c_AliasDecl.m_new=function(t_ident,t_attrs,t_decl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<315>";
	c_Decl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<316>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<317>";
	dbg_object(this).m_attrs=t_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<318>";
	dbg_object(this).m_decl=t_decl;
	pop_err();
	return this;
}
c_AliasDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<311>";
	c_Decl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<311>";
	pop_err();
	return this;
}
c_AliasDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<322>";
	var t_=(c_AliasDecl.m_new.call(new c_AliasDecl,this.m_ident,this.m_attrs,this.m_decl));
	pop_err();
	return t_;
}
c_AliasDecl.prototype.p_OnSemant=function(){
	push_err();
	pop_err();
	return 0;
}
function c_Enumerator(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator.m_new=function(t_list){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<308>";
	this.m__list=t_list;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<309>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<305>";
	pop_err();
	return this;
}
c_Enumerator.prototype.p_HasNext=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<313>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<314>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<316>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator.prototype.p_NextObject=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<320>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<321>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<322>";
	pop_err();
	return t_data;
}
var bb_config__errStack=null;
function bb_config_PushErr(t_errInfo){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<54>";
	bb_config__errStack.p_AddLast(bb_config__errInfo);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<55>";
	bb_config__errInfo=t_errInfo;
	pop_err();
	return 0;
}
function c_VarDecl(){
	c_ValDecl.call(this);
}
c_VarDecl.prototype=extend_class(c_ValDecl);
c_VarDecl.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<231>";
	c_ValDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<231>";
	pop_err();
	return this;
}
function c_GlobalDecl(){
	c_VarDecl.call(this);
}
c_GlobalDecl.prototype=extend_class(c_VarDecl);
c_GlobalDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<275>";
	c_VarDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<276>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<277>";
	dbg_object(this).m_attrs=t_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<278>";
	dbg_object(this).m_type=t_type;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<279>";
	dbg_object(this).m_init=t_init;
	pop_err();
	return this;
}
c_GlobalDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<273>";
	c_VarDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<273>";
	pop_err();
	return this;
}
c_GlobalDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<283>";
	var t_=(c_GlobalDecl.m_new.call(new c_GlobalDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
	pop_err();
	return t_;
}
c_GlobalDecl.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<287>";
	var t_="Global "+c_ValDecl.prototype.p_ToString.call(this);
	pop_err();
	return t_;
}
function c_List6(){
	Object.call(this);
	this.m__head=(c_HeadNode6.m_new.call(new c_HeadNode6));
}
c_List6.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List6.prototype.p_AddLast6=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<126>";
	var t_=c_Node9.m_new.call(new c_Node9,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List6.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<14>";
		this.p_AddLast6(t_t);
	}
	pop_err();
	return this;
}
function c_Node9(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node9.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<243>";
	this.m__succ=t_succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<244>";
	this.m__pred=t_pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<245>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<246>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<247>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node9.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<240>";
	pop_err();
	return this;
}
function c_HeadNode6(){
	c_Node9.call(this);
}
c_HeadNode6.prototype=extend_class(c_Node9);
c_HeadNode6.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<292>";
	c_Node9.m_new2.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<293>";
	this.m__succ=(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<294>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function bb_decl_PopEnv(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<34>";
	if(bb_decl__envStack.p_IsEmpty()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<34>";
		bb_config_InternalErr("Internal error");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<35>";
	bb_decl__env=bb_decl__envStack.p_RemoveLast();
	pop_err();
	return 0;
}
function bb_config_PopErr(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<59>";
	bb_config__errInfo=bb_config__errStack.p_RemoveLast();
	pop_err();
	return 0;
}
function c_LocalDecl(){
	c_VarDecl.call(this);
}
c_LocalDecl.prototype=extend_class(c_VarDecl);
c_LocalDecl.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<249>";
	var t_="Local "+c_ValDecl.prototype.p_ToString.call(this);
	pop_err();
	return t_;
}
c_LocalDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<237>";
	c_VarDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<238>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<239>";
	dbg_object(this).m_attrs=t_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<240>";
	dbg_object(this).m_type=t_type;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<241>";
	dbg_object(this).m_init=t_init;
	pop_err();
	return this;
}
c_LocalDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<235>";
	c_VarDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<235>";
	pop_err();
	return this;
}
c_LocalDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<245>";
	var t_=(c_LocalDecl.m_new.call(new c_LocalDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
	pop_err();
	return t_;
}
function c_ArgDecl(){
	c_LocalDecl.call(this);
}
c_ArgDecl.prototype=extend_class(c_LocalDecl);
c_ArgDecl.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<268>";
	var t_=c_LocalDecl.prototype.p_ToString.call(this);
	pop_err();
	return t_;
}
c_ArgDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<256>";
	c_LocalDecl.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<257>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<258>";
	dbg_object(this).m_attrs=t_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<259>";
	dbg_object(this).m_type=t_type;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<260>";
	dbg_object(this).m_init=t_init;
	pop_err();
	return this;
}
c_ArgDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<254>";
	c_LocalDecl.m_new2.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<254>";
	pop_err();
	return this;
}
c_ArgDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<264>";
	var t_=(c_ArgDecl.m_new.call(new c_ArgDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
	pop_err();
	return t_;
}
function c_InvokeMemberExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_decl=null;
	this.m_args=[];
	this.m_isResize=0;
}
c_InvokeMemberExpr.prototype=extend_class(c_Expr);
c_InvokeMemberExpr.m_new=function(t_expr,t_decl,t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<331>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<332>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<333>";
	dbg_object(this).m_decl=t_decl;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<334>";
	dbg_object(this).m_args=t_args;
	pop_err();
	return this;
}
c_InvokeMemberExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<325>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<325>";
	pop_err();
	return this;
}
c_InvokeMemberExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<346>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<346>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<348>";
	this.m_exprType=dbg_object(this.m_decl).m_retType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<349>";
	this.m_args=this.p_CastArgs(this.m_args,this.m_decl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<352>";
	if(((object_downcast((this.m_exprType),c_ArrayType))!=null) && ((object_downcast((dbg_object(object_downcast((this.m_exprType),c_ArrayType)).m_elemType),c_VoidType))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<353>";
		this.m_isResize=1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<354>";
		this.m_exprType=dbg_object(this.m_expr).m_exprType;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<357>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_InvokeMemberExpr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<338>";
	var t_t="InvokeMemberExpr("+this.m_expr.p_ToString()+","+this.m_decl.p_ToString();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<339>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<339>";
	var t_=this.m_args;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<339>";
	var t_2=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<339>";
	while(t_2<t_.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<339>";
		var t_arg=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<339>";
		t_2=t_2+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<340>";
		t_t=t_t+(","+t_arg.p_ToString());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<342>";
	var t_3=t_t+")";
	pop_err();
	return t_3;
}
function bb_preprocessor_Eval(t_source,t_ty){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<8>";
	var t_env=c_ScopeDecl.m_new.call(new c_ScopeDecl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<10>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<10>";
	var t_=bb_config__cfgVars.p_ObjectEnumerator();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<10>";
	while(t_.p_HasNext()){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<10>";
		var t_kv=t_.p_NextObject();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<11>";
		t_env.p_InsertDecl(c_ConstDecl.m_new.call(new c_ConstDecl,t_kv.p_Key(),0,(c_Type.m_stringType),(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_stringType),t_kv.p_Value()))));
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<14>";
	bb_decl_PushEnv(t_env);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<16>";
	var t_toker=c_Toker.m_new.call(new c_Toker,"",t_source);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<18>";
	var t_parser=c_Parser.m_new.call(new c_Parser,t_toker,null,null,0,null);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<20>";
	var t_expr=t_parser.p_ParseExpr().p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<22>";
	var t_val="";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<24>";
	if(((object_downcast((t_ty),c_StringType))!=null) && ((object_downcast((dbg_object(t_expr).m_exprType),c_BoolType))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<25>";
		t_val=t_expr.p_Eval();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<26>";
		if((t_val).length!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<26>";
			t_val="1";
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<26>";
			t_val="0";
		}
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<27>";
		if(((object_downcast((t_ty),c_BoolType))!=null) && ((object_downcast((dbg_object(t_expr).m_exprType),c_StringType))!=null)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<28>";
			t_val=t_expr.p_Eval();
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<29>";
			if(((t_val).length!=0) && t_val!="0"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<29>";
				t_val="1";
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<29>";
				t_val="0";
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<31>";
			if((t_ty)!=null){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<31>";
				t_expr=t_expr.p_Cast(t_ty,0);
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<32>";
			t_val=t_expr.p_Eval();
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<35>";
	bb_decl_PopEnv();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<37>";
	pop_err();
	return t_val;
}
function bb_preprocessor_Eval2(t_toker,t_type){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<41>";
	var t_buf=c_StringStack.m_new2.call(new c_StringStack);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<42>";
	while(((t_toker.p_Toke()).length!=0) && t_toker.p_Toke()!="\n" && t_toker.p_TokeType()!=9){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<43>";
		t_buf.p_Push(t_toker.p_Toke());
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<44>";
		t_toker.p_NextToke();
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<46>";
	var t_=bb_preprocessor_Eval(t_buf.p_Join(""),t_type);
	pop_err();
	return t_;
}
function bb_config_EvalCfgTags(t_cfg){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<26>";
	var t_i=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<27>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<28>";
		t_i=t_cfg.indexOf("${",0);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<29>";
		if(t_i==-1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<29>";
			pop_err();
			return t_cfg;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<31>";
		var t_e=t_cfg.indexOf("}",t_i+2);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<32>";
		if(t_e==-1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<32>";
			pop_err();
			return t_cfg;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<34>";
		var t_key=t_cfg.slice(t_i+2,t_e);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<35>";
		if(!bb_config__cfgVars.p_Contains(t_key)){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<36>";
			t_i=t_e+1;
			err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<37>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<40>";
		var t_t=bb_config__cfgVars.p_Get(t_key);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<41>";
		bb_config__cfgVars.p_Set(t_key,"");
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<42>";
		var t_v=bb_config_EvalCfgTags(t_t);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<43>";
		bb_config__cfgVars.p_Set(t_key,t_t);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<45>";
		t_cfg=t_cfg.slice(0,t_i)+t_v+t_cfg.slice(t_e+1);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/config.monkey<46>";
		t_i+=t_v.length;
	}while(!(false));
}
function bb_preprocessor_PreProcess(t_path){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<51>";
	var t_cnest=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<51>";
	var t_ifnest=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<51>";
	var t_line=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<51>";
	var t_source=c_StringStack.m_new2.call(new c_StringStack);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<53>";
	var t_toker=c_Toker.m_new.call(new c_Toker,t_path,LoadString(t_path));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<54>";
	t_toker.p_NextToke();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<56>";
	bb_config_SetCfgVar("CD",bb_os_ExtractDir(RealPath(t_path)));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<58>";
	do{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<60>";
		if((t_line)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<61>";
			t_source.p_Push("\n");
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<62>";
			while(((t_toker.p_Toke()).length!=0) && t_toker.p_Toke()!="\n" && t_toker.p_TokeType()!=9){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<63>";
				t_toker.p_NextToke();
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<65>";
			if(!((t_toker.p_Toke()).length!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<65>";
				break;
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<66>";
			t_toker.p_NextToke();
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<68>";
		t_line+=1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<70>";
		bb_config__errInfo=t_toker.p_Path()+"<"+String(t_toker.p_Line())+">";
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<72>";
		if(t_toker.p_TokeType()==1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<72>";
			t_toker.p_NextToke();
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<74>";
		if(t_toker.p_Toke()!="#"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<75>";
			if(t_cnest==t_ifnest){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<76>";
				var t_line2="";
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<77>";
				while(((t_toker.p_Toke()).length!=0) && t_toker.p_Toke()!="\n" && t_toker.p_TokeType()!=9){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<78>";
					var t_toke=t_toker.p_Toke();
					err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<79>";
					t_line2=t_line2+t_toke;
					err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<80>";
					t_toker.p_NextToke();
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<82>";
				if((t_line2).length!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<82>";
					t_source.p_Push(t_line2);
				}
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<84>";
			continue;
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<87>";
		var t_toke2=t_toker.p_NextToke();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<88>";
		if(t_toker.p_TokeType()==1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<88>";
			t_toke2=t_toker.p_NextToke();
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<90>";
		var t_stm=t_toke2.toLowerCase();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<91>";
		var t_ty=t_toker.p_TokeType();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<93>";
		t_toker.p_NextToke();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<95>";
		if(t_stm=="end" || t_stm=="else"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<96>";
			if(t_toker.p_TokeType()==1){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<96>";
				t_toker.p_NextToke();
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<97>";
			if(t_toker.p_Toke().toLowerCase()=="if"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<98>";
				t_toker.p_NextToke();
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<99>";
				t_stm=t_stm+"if";
			}
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<103>";
		var t_=t_stm;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<104>";
		if(t_=="rem"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<106>";
			t_ifnest+=1;
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<108>";
			if(t_=="if"){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<110>";
				t_ifnest+=1;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<112>";
				if(t_cnest==t_ifnest-1){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<113>";
					if((bb_preprocessor_Eval2(t_toker,(c_Type.m_boolType))).length!=0){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<113>";
						t_cnest=t_ifnest;
					}
				}
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<116>";
				if(t_=="else"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<118>";
					if(!((t_ifnest)!=0)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<118>";
						bb_config_Err("#Else without #If");
					}
					err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<120>";
					if(t_cnest==t_ifnest){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<121>";
						t_cnest|=65536;
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<122>";
						if(t_cnest==t_ifnest-1){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<123>";
							t_cnest=t_ifnest;
						}
					}
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<126>";
					if(t_=="elseif"){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<128>";
						if(!((t_ifnest)!=0)){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<128>";
							bb_config_Err("#ElseIf without #If");
						}
						err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<130>";
						if(t_cnest==t_ifnest){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<131>";
							t_cnest|=65536;
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<132>";
							if(t_cnest==t_ifnest-1){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<133>";
								if((bb_preprocessor_Eval2(t_toker,(c_Type.m_boolType))).length!=0){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<133>";
									t_cnest=t_ifnest;
								}
							}
						}
					}else{
						err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<136>";
						if(t_=="end" || t_=="endif"){
							err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<138>";
							if(!((t_ifnest)!=0)){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<138>";
								bb_config_Err("#End without #If or #Rem");
							}
							err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<140>";
							t_ifnest-=1;
							err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<142>";
							if(t_ifnest<(t_cnest&65535)){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<142>";
								t_cnest=t_ifnest;
							}
						}else{
							err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<144>";
							if(t_=="print"){
								err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<146>";
								if(t_cnest==t_ifnest){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<147>";
									print(bb_config_EvalCfgTags(bb_preprocessor_Eval2(t_toker,(c_Type.m_stringType))));
								}
							}else{
								err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<150>";
								if(t_=="error"){
									err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<152>";
									if(t_cnest==t_ifnest){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<153>";
										bb_config_Err(bb_config_EvalCfgTags(bb_preprocessor_Eval2(t_toker,(c_Type.m_stringType))));
									}
								}else{
									err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<158>";
									if(t_cnest==t_ifnest){
										err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<159>";
										if(t_ty==2){
											err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<161>";
											if(t_toker.p_TokeType()==1){
												err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<161>";
												t_toker.p_NextToke();
											}
											err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<162>";
											var t_op=t_toker.p_Toke();
											err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<164>";
											if(t_op=="=" || t_op=="+="){
												err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<166>";
												var t_2=t_toke2;
												err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<167>";
												if(t_2=="HOST" || t_2=="LANG" || t_2=="CONFIG" || t_2=="TARGET" || t_2=="SAFEMODE"){
													err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<168>";
													bb_config_Err("App config var '"+t_toke2+"' cannot be modified");
												}
												err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<171>";
												t_toker.p_NextToke();
												err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<173>";
												var t_val=bb_config_EvalCfgTags(bb_preprocessor_Eval2(t_toker,(c_Type.m_stringType)));
												err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<175>";
												if(t_op=="="){
													err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<176>";
													if(!((bb_config_GetCfgVar(t_toke2)).length!=0)){
														err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<176>";
														bb_config_SetCfgVar(t_toke2,t_val);
													}
												}else{
													err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<177>";
													if(t_op=="+="){
														err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<178>";
														var t_var=bb_config_GetCfgVar(t_toke2);
														err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<179>";
														if(((t_var).length!=0) && !string_startswith(t_val,";")){
															err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<179>";
															t_val=";"+t_val;
														}
														err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<180>";
														bb_config_SetCfgVar(t_toke2,t_var+t_val);
													}
												}
											}else{
												err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<183>";
												bb_config_Err("Syntax error - expecting assignment");
											}
										}else{
											err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<186>";
											bb_config_Err("Unrecognized preprocessor directive '"+t_toke2+"'");
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}while(!(false));
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<194>";
	bb_config_SetCfgVar("CD","");
	err_info="/Users/tluyben/Monkey-Interpeter/trans/preprocessor.monkey<196>";
	var t_3=t_source.p_Join("");
	pop_err();
	return t_3;
}
function bb_parser_ParseModule(t_path,t_app){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1812>";
	var t_source=bb_preprocessor_PreProcess(t_path);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1814>";
	var t_toker=c_Toker.m_new.call(new c_Toker,t_path,t_source);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1816>";
	var t_parser=c_Parser.m_new.call(new c_Parser,t_toker,t_app,null,0,null);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1818>";
	t_parser.p_ParseMain();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1820>";
	pop_err();
	return dbg_object(t_parser).m__module;
}
var bb_config_ENV_SAFEMODE=0;
function c_FieldDecl(){
	c_VarDecl.call(this);
}
c_FieldDecl.prototype=extend_class(c_VarDecl);
c_FieldDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<294>";
	c_VarDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<295>";
	dbg_object(this).m_ident=t_ident;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<296>";
	dbg_object(this).m_attrs=t_attrs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<297>";
	dbg_object(this).m_type=t_type;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<298>";
	dbg_object(this).m_init=t_init;
	pop_err();
	return this;
}
c_FieldDecl.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<292>";
	c_VarDecl.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<292>";
	pop_err();
	return this;
}
c_FieldDecl.prototype.p_OnCopy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<302>";
	var t_=(c_FieldDecl.m_new.call(new c_FieldDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
	pop_err();
	return t_;
}
c_FieldDecl.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/decl.monkey<306>";
	var t_="Field "+c_ValDecl.prototype.p_ToString.call(this);
	pop_err();
	return t_;
}
function c_Enumerator2(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator2.m_new=function(t_list){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<308>";
	this.m__list=t_list;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<309>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator2.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<305>";
	pop_err();
	return this;
}
c_Enumerator2.prototype.p_HasNext=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<313>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<314>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<316>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator2.prototype.p_NextObject=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<320>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<321>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<322>";
	pop_err();
	return t_data;
}
function c_Stack4(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack4.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_Stack4.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<13>";
	dbg_object(this).m_data=t_data.slice(0);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<14>";
	dbg_object(this).m_length=t_data.length;
	pop_err();
	return this;
}
c_Stack4.prototype.p_Push10=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<55>";
	if(this.m_length==this.m_data.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<56>";
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<58>";
	dbg_array(this.m_data,this.m_length)[dbg_index]=t_value
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<59>";
	this.m_length+=1;
	pop_err();
	return 0;
}
c_Stack4.prototype.p_Push11=function(t_values,t_offset,t_count){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<69>";
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<70>";
		this.p_Push10(dbg_array(t_values,t_offset+t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack4.prototype.p_Push12=function(t_values,t_offset){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<63>";
	for(var t_i=t_offset;t_i<t_values.length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<64>";
		this.p_Push10(dbg_array(t_values,t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack4.prototype.p_ToArray=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<18>";
	var t_t=new_object_array(this.m_length);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<19>";
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<20>";
		dbg_array(t_t,t_i)[dbg_index]=dbg_array(this.m_data,t_i)[dbg_index]
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<22>";
	pop_err();
	return t_t;
}
function c_List7(){
	Object.call(this);
	this.m__head=(c_HeadNode7.m_new.call(new c_HeadNode7));
}
c_List7.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List7.prototype.p_AddLast7=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<126>";
	var t_=c_Node10.m_new.call(new c_Node10,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List7.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<14>";
		this.p_AddLast7(t_t);
	}
	pop_err();
	return this;
}
c_List7.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<168>";
	var t_=c_Enumerator3.m_new.call(new c_Enumerator3,this);
	pop_err();
	return t_;
}
function c_Node10(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node10.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<243>";
	this.m__succ=t_succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<244>";
	this.m__pred=t_pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<245>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<246>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<247>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node10.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<240>";
	pop_err();
	return this;
}
function c_HeadNode7(){
	c_Node10.call(this);
}
c_HeadNode7.prototype=extend_class(c_Node10);
c_HeadNode7.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<292>";
	c_Node10.m_new2.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<293>";
	this.m__succ=(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<294>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_Stack5(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack5.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_Stack5.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<13>";
	dbg_object(this).m_data=t_data.slice(0);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<14>";
	dbg_object(this).m_length=t_data.length;
	pop_err();
	return this;
}
c_Stack5.prototype.p_Push13=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<55>";
	if(this.m_length==this.m_data.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<56>";
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<58>";
	dbg_array(this.m_data,this.m_length)[dbg_index]=t_value
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<59>";
	this.m_length+=1;
	pop_err();
	return 0;
}
c_Stack5.prototype.p_Push14=function(t_values,t_offset,t_count){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<69>";
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<70>";
		this.p_Push13(dbg_array(t_values,t_offset+t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack5.prototype.p_Push15=function(t_values,t_offset){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<63>";
	for(var t_i=t_offset;t_i<t_values.length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<64>";
		this.p_Push13(dbg_array(t_values,t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack5.prototype.p_ToArray=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<18>";
	var t_t=new_object_array(this.m_length);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<19>";
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<20>";
		dbg_array(t_t,t_i)[dbg_index]=dbg_array(this.m_data,t_i)[dbg_index]
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<22>";
	pop_err();
	return t_t;
}
function c_List8(){
	Object.call(this);
	this.m__head=(c_HeadNode8.m_new.call(new c_HeadNode8));
}
c_List8.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List8.prototype.p_AddLast8=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<126>";
	var t_=c_Node11.m_new.call(new c_Node11,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List8.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<14>";
		this.p_AddLast8(t_t);
	}
	pop_err();
	return this;
}
c_List8.prototype.p_IsEmpty=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<50>";
	var t_=dbg_object(this.m__head).m__succ==this.m__head;
	pop_err();
	return t_;
}
c_List8.prototype.p_RemoveLast=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<94>";
	if(this.p_IsEmpty()){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<94>";
		error("Illegal operation on empty list");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<96>";
	var t_data=dbg_object(this.m__head.p_PrevNode()).m__data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<97>";
	dbg_object(this.m__head).m__pred.p_Remove();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<98>";
	pop_err();
	return t_data;
}
function c_Node11(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node11.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<243>";
	this.m__succ=t_succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<244>";
	this.m__pred=t_pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<245>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<246>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<247>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node11.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<240>";
	pop_err();
	return this;
}
c_Node11.prototype.p_GetNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<283>";
	pop_err();
	return this;
}
c_Node11.prototype.p_PrevNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<271>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<271>";
		error("Illegal operation on removed node");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<273>";
	var t_=this.m__pred.p_GetNode();
	pop_err();
	return t_;
}
c_Node11.prototype.p_Remove=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<256>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<256>";
		error("Illegal operation on removed node");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<258>";
	dbg_object(this.m__succ).m__pred=this.m__pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<259>";
	dbg_object(this.m__pred).m__succ=this.m__succ;
	pop_err();
	return 0;
}
function c_HeadNode8(){
	c_Node11.call(this);
}
c_HeadNode8.prototype=extend_class(c_Node11);
c_HeadNode8.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<292>";
	c_Node11.m_new2.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<293>";
	this.m__succ=(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<294>";
	this.m__pred=(this);
	pop_err();
	return this;
}
c_HeadNode8.prototype.p_GetNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<298>";
	pop_err();
	return null;
}
function c_DeclStmt(){
	c_Stmt.call(this);
	this.m_decl=null;
}
c_DeclStmt.prototype=extend_class(c_Stmt);
c_DeclStmt.m_new=function(t_decl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<39>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<40>";
	dbg_object(this).m_decl=t_decl;
	pop_err();
	return this;
}
c_DeclStmt.m_new2=function(t_id,t_ty,t_init){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<43>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<44>";
	dbg_object(this).m_decl=(c_LocalDecl.m_new.call(new c_LocalDecl,t_id,0,t_ty,t_init));
	pop_err();
	return this;
}
c_DeclStmt.m_new3=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<36>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<36>";
	pop_err();
	return this;
}
c_DeclStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<52>";
	this.m_decl.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<53>";
	bb_decl__env.p_InsertDecl(this.m_decl);
	pop_err();
	return 0;
}
c_DeclStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<48>";
	var t_=(c_DeclStmt.m_new.call(new c_DeclStmt,this.m_decl.p_Copy()));
	pop_err();
	return t_;
}
function c_ReturnStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
}
c_ReturnStmt.prototype=extend_class(c_Stmt);
c_ReturnStmt.m_new=function(t_expr){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<200>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<201>";
	dbg_object(this).m_expr=t_expr;
	pop_err();
	return this;
}
c_ReturnStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<197>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<197>";
	pop_err();
	return this;
}
c_ReturnStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<210>";
	var t_fdecl=bb_decl__env.p_FuncScope();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<211>";
	if((this.m_expr)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<212>";
		if(t_fdecl.p_IsCtor()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<212>";
			bb_config_Err("Constructors may not return a value.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<213>";
		if((object_downcast((dbg_object(t_fdecl).m_retType),c_VoidType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<213>";
			bb_config_Err("Void functions may not return a value.");
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<214>";
		this.m_expr=this.m_expr.p_Semant2(dbg_object(t_fdecl).m_retType,0);
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<215>";
		if(t_fdecl.p_IsCtor()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<216>";
			this.m_expr=(c_SelfExpr.m_new.call(new c_SelfExpr)).p_Semant();
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<217>";
			if(!((object_downcast((dbg_object(t_fdecl).m_retType),c_VoidType))!=null)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<218>";
				if((bb_decl__env.p_ModuleScope().p_IsStrict())!=0){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<218>";
					bb_config_Err("Missing return expression.");
				}
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<219>";
				this.m_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,dbg_object(t_fdecl).m_retType,"")).p_Semant();
			}
		}
	}
	pop_err();
	return 0;
}
c_ReturnStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<205>";
	if((this.m_expr)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<205>";
		var t_=(c_ReturnStmt.m_new.call(new c_ReturnStmt,this.m_expr.p_Copy()));
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<206>";
	var t_2=(c_ReturnStmt.m_new.call(new c_ReturnStmt,null));
	pop_err();
	return t_2;
}
function c_BreakStmt(){
	c_Stmt.call(this);
}
c_BreakStmt.prototype=extend_class(c_Stmt);
c_BreakStmt.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<228>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<228>";
	pop_err();
	return this;
}
c_BreakStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<235>";
	if(!((bb_decl__loopnest)!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<235>";
		bb_config_Err("Exit statement must appear inside a loop.");
	}
	pop_err();
	return 0;
}
c_BreakStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<231>";
	var t_=(c_BreakStmt.m_new.call(new c_BreakStmt));
	pop_err();
	return t_;
}
function c_ContinueStmt(){
	c_Stmt.call(this);
}
c_ContinueStmt.prototype=extend_class(c_Stmt);
c_ContinueStmt.m_new=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<244>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<244>";
	pop_err();
	return this;
}
c_ContinueStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<251>";
	if(!((bb_decl__loopnest)!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<251>";
		bb_config_Err("Continue statement must appear inside a loop.");
	}
	pop_err();
	return 0;
}
c_ContinueStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<247>";
	var t_=(c_ContinueStmt.m_new.call(new c_ContinueStmt));
	pop_err();
	return t_;
}
function c_IfStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
	this.m_thenBlock=null;
	this.m_elseBlock=null;
}
c_IfStmt.prototype=extend_class(c_Stmt);
c_IfStmt.m_new=function(t_expr,t_thenBlock,t_elseBlock){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<265>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<266>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<267>";
	dbg_object(this).m_thenBlock=t_thenBlock;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<268>";
	dbg_object(this).m_elseBlock=t_elseBlock;
	pop_err();
	return this;
}
c_IfStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<260>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<260>";
	pop_err();
	return this;
}
c_IfStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<276>";
	this.m_expr=this.m_expr.p_Semant2((c_Type.m_boolType),1);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<277>";
	this.m_thenBlock.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<278>";
	this.m_elseBlock.p_Semant();
	pop_err();
	return 0;
}
c_IfStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<272>";
	var t_=(c_IfStmt.m_new.call(new c_IfStmt,this.m_expr.p_Copy(),this.m_thenBlock.p_CopyBlock(t_scope),this.m_elseBlock.p_CopyBlock(t_scope)));
	pop_err();
	return t_;
}
function c_WhileStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
	this.m_block=null;
}
c_WhileStmt.prototype=extend_class(c_Stmt);
c_WhileStmt.m_new=function(t_expr,t_block){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<290>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<291>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<292>";
	dbg_object(this).m_block=t_block;
	pop_err();
	return this;
}
c_WhileStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<286>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<286>";
	pop_err();
	return this;
}
c_WhileStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<300>";
	this.m_expr=this.m_expr.p_Semant2((c_Type.m_boolType),1);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<301>";
	bb_decl__loopnest+=1;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<302>";
	this.m_block.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<303>";
	bb_decl__loopnest-=1;
	pop_err();
	return 0;
}
c_WhileStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<296>";
	var t_=(c_WhileStmt.m_new.call(new c_WhileStmt,this.m_expr.p_Copy(),this.m_block.p_CopyBlock(t_scope)));
	pop_err();
	return t_;
}
function c_RepeatStmt(){
	c_Stmt.call(this);
	this.m_block=null;
	this.m_expr=null;
}
c_RepeatStmt.prototype=extend_class(c_Stmt);
c_RepeatStmt.m_new=function(t_block,t_expr){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<315>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<316>";
	dbg_object(this).m_block=t_block;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<317>";
	dbg_object(this).m_expr=t_expr;
	pop_err();
	return this;
}
c_RepeatStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<311>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<311>";
	pop_err();
	return this;
}
c_RepeatStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<325>";
	bb_decl__loopnest+=1;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<326>";
	this.m_block.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<327>";
	bb_decl__loopnest-=1;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<328>";
	this.m_expr=this.m_expr.p_Semant2((c_Type.m_boolType),1);
	pop_err();
	return 0;
}
c_RepeatStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<321>";
	var t_=(c_RepeatStmt.m_new.call(new c_RepeatStmt,this.m_block.p_CopyBlock(t_scope),this.m_expr.p_Copy()));
	pop_err();
	return t_;
}
function c_ForEachinStmt(){
	c_Stmt.call(this);
	this.m_varid="";
	this.m_varty=null;
	this.m_varlocal=0;
	this.m_expr=null;
	this.m_block=null;
}
c_ForEachinStmt.prototype=extend_class(c_Stmt);
c_ForEachinStmt.m_new=function(t_varid,t_varty,t_varlocal,t_expr,t_block){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<43>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<44>";
	dbg_object(this).m_varid=t_varid;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<45>";
	dbg_object(this).m_varty=t_varty;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<46>";
	dbg_object(this).m_varlocal=t_varlocal;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<47>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<48>";
	dbg_object(this).m_block=t_block;
	pop_err();
	return this;
}
c_ForEachinStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<36>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<36>";
	pop_err();
	return this;
}
c_ForEachinStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<56>";
	this.m_expr=this.m_expr.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<58>";
	if(((object_downcast((dbg_object(this.m_expr).m_exprType),c_ArrayType))!=null) || ((object_downcast((dbg_object(this.m_expr).m_exprType),c_StringType))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<60>";
		var t_exprTmp=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,null,this.m_expr);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<61>";
		var t_indexTmp=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,null,(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_intType),"0")));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<63>";
		var t_lenExpr=(c_IdentExpr.m_new.call(new c_IdentExpr,"Length",(c_VarExpr.m_new.call(new c_VarExpr,(t_exprTmp)))));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<65>";
		var t_cmpExpr=(c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,"<",(c_VarExpr.m_new.call(new c_VarExpr,(t_indexTmp))),t_lenExpr));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<67>";
		var t_indexExpr=(c_IndexExpr.m_new.call(new c_IndexExpr,(c_VarExpr.m_new.call(new c_VarExpr,(t_exprTmp))),(c_VarExpr.m_new.call(new c_VarExpr,(t_indexTmp)))));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<68>";
		var t_addExpr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,"+",(c_VarExpr.m_new.call(new c_VarExpr,(t_indexTmp))),(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_intType),"1"))));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<70>";
		dbg_object(this.m_block).m_stmts.p_AddFirst(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_VarExpr.m_new.call(new c_VarExpr,(t_indexTmp))),t_addExpr));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<72>";
		if((this.m_varlocal)!=0){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<73>";
			var t_varTmp=c_LocalDecl.m_new.call(new c_LocalDecl,this.m_varid,0,this.m_varty,t_indexExpr);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<74>";
			dbg_object(this.m_block).m_stmts.p_AddFirst(c_DeclStmt.m_new.call(new c_DeclStmt,(t_varTmp)));
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<76>";
			dbg_object(this.m_block).m_stmts.p_AddFirst(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_IdentExpr.m_new.call(new c_IdentExpr,this.m_varid,null)),t_indexExpr));
		}
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<79>";
		var t_whileStmt=c_WhileStmt.m_new.call(new c_WhileStmt,t_cmpExpr,this.m_block);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<81>";
		this.m_block=c_BlockDecl.m_new.call(new c_BlockDecl,dbg_object(this.m_block).m_scope);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<82>";
		this.m_block.p_AddStmt(c_DeclStmt.m_new.call(new c_DeclStmt,(t_exprTmp)));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<83>";
		this.m_block.p_AddStmt(c_DeclStmt.m_new.call(new c_DeclStmt,(t_indexTmp)));
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<84>";
		this.m_block.p_AddStmt(t_whileStmt);
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<86>";
		if((object_downcast((dbg_object(this.m_expr).m_exprType),c_ObjectType))!=null){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<88>";
			var t_enumerInit=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,(c_IdentExpr.m_new.call(new c_IdentExpr,"ObjectEnumerator",this.m_expr)),[]));
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<89>";
			var t_enumerTmp=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,null,t_enumerInit);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<91>";
			var t_hasNextExpr=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,(c_IdentExpr.m_new.call(new c_IdentExpr,"HasNext",(c_VarExpr.m_new.call(new c_VarExpr,(t_enumerTmp))))),[]));
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<92>";
			var t_nextObjExpr=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,(c_IdentExpr.m_new.call(new c_IdentExpr,"NextObject",(c_VarExpr.m_new.call(new c_VarExpr,(t_enumerTmp))))),[]));
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<94>";
			if((this.m_varlocal)!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<95>";
				var t_varTmp2=c_LocalDecl.m_new.call(new c_LocalDecl,this.m_varid,0,this.m_varty,t_nextObjExpr);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<96>";
				dbg_object(this.m_block).m_stmts.p_AddFirst(c_DeclStmt.m_new.call(new c_DeclStmt,(t_varTmp2)));
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<98>";
				dbg_object(this.m_block).m_stmts.p_AddFirst(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_IdentExpr.m_new.call(new c_IdentExpr,this.m_varid,null)),t_nextObjExpr));
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<101>";
			var t_whileStmt2=c_WhileStmt.m_new.call(new c_WhileStmt,t_hasNextExpr,this.m_block);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<103>";
			this.m_block=c_BlockDecl.m_new.call(new c_BlockDecl,dbg_object(this.m_block).m_scope);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<104>";
			this.m_block.p_AddStmt(c_DeclStmt.m_new.call(new c_DeclStmt,(t_enumerTmp)));
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<105>";
			this.m_block.p_AddStmt(t_whileStmt2);
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<109>";
			bb_config_Err("Expression cannot be used with For Each.");
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<113>";
	this.m_block.p_Semant();
	pop_err();
	return 0;
}
c_ForEachinStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<52>";
	var t_=(c_ForEachinStmt.m_new.call(new c_ForEachinStmt,this.m_varid,this.m_varty,this.m_varlocal,this.m_expr.p_Copy(),this.m_block.p_CopyBlock(t_scope)));
	pop_err();
	return t_;
}
function c_AssignStmt(){
	c_Stmt.call(this);
	this.m_op="";
	this.m_lhs=null;
	this.m_rhs=null;
	this.m_tmp1=null;
	this.m_tmp2=null;
}
c_AssignStmt.prototype=extend_class(c_Stmt);
c_AssignStmt.m_new=function(t_op,t_lhs,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<68>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<69>";
	dbg_object(this).m_op=t_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<70>";
	dbg_object(this).m_lhs=t_lhs;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<71>";
	dbg_object(this).m_rhs=t_rhs;
	pop_err();
	return this;
}
c_AssignStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<61>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<61>";
	pop_err();
	return this;
}
c_AssignStmt.prototype.p_FixSideEffects=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<84>";
	var t_e1=object_downcast((this.m_lhs),c_MemberVarExpr);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<85>";
	if((t_e1)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<86>";
		if(dbg_object(t_e1).m_expr.p_SideEffects()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<87>";
			this.m_tmp1=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,dbg_object(dbg_object(t_e1).m_expr).m_exprType,dbg_object(t_e1).m_expr);
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<88>";
			this.m_lhs=(c_MemberVarExpr.m_new.call(new c_MemberVarExpr,(c_VarExpr.m_new.call(new c_VarExpr,(this.m_tmp1))),dbg_object(t_e1).m_decl)).p_Semant();
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<92>";
	var t_e2=object_downcast((this.m_lhs),c_IndexExpr);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<93>";
	if((t_e2)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<94>";
		var t_expr=dbg_object(t_e2).m_expr;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<95>";
		var t_index=dbg_object(t_e2).m_index;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<96>";
		if(t_expr.p_SideEffects() || t_index.p_SideEffects()){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<97>";
			if(t_expr.p_SideEffects()){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<98>";
				this.m_tmp1=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,dbg_object(t_expr).m_exprType,t_expr);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<99>";
				t_expr=(c_VarExpr.m_new.call(new c_VarExpr,(this.m_tmp1)));
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<101>";
			if(t_index.p_SideEffects()){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<102>";
				this.m_tmp2=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,dbg_object(t_index).m_exprType,t_index);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<103>";
				t_index=(c_VarExpr.m_new.call(new c_VarExpr,(this.m_tmp2)));
			}
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<105>";
			this.m_lhs=(c_IndexExpr.m_new.call(new c_IndexExpr,t_expr,t_index)).p_Semant();
		}
	}
	pop_err();
	return 0;
}
c_AssignStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<113>";
	this.m_rhs=this.m_rhs.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<114>";
	this.m_lhs=this.m_lhs.p_SemantSet(this.m_op,this.m_rhs);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<116>";
	if(((object_downcast((this.m_lhs),c_InvokeExpr))!=null) || ((object_downcast((this.m_lhs),c_InvokeMemberExpr))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<117>";
		this.m_rhs=null;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<118>";
		pop_err();
		return 0;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<121>";
	var t_kludge=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<123>";
	var t_=this.m_op;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<124>";
	if(t_=="="){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<125>";
		this.m_rhs=this.m_rhs.p_Cast(dbg_object(this.m_lhs).m_exprType,0);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<126>";
		t_kludge=0;
	}else{
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<127>";
		if(t_=="*=" || t_=="/=" || t_=="+=" || t_=="-="){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<128>";
			if(((object_downcast((dbg_object(this.m_lhs).m_exprType),c_NumericType))!=null) && ((dbg_object(this.m_lhs).m_exprType.p_EqualsType(dbg_object(this.m_rhs).m_exprType))!=0)){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<130>";
				t_kludge=0;
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<134>";
				if(bb_config_ENV_LANG=="js"){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<135>";
					if(this.m_op=="/=" && ((object_downcast((dbg_object(this.m_lhs).m_exprType),c_IntType))!=null)){
						err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<136>";
						t_kludge=1;
					}
				}
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<142>";
				t_kludge=1;
			}
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<144>";
			if(t_=="&=" || t_=="|=" || t_=="~=" || t_=="shl=" || t_=="shr=" || t_=="mod="){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<145>";
				if(((object_downcast((dbg_object(this.m_lhs).m_exprType),c_IntType))!=null) && ((dbg_object(this.m_lhs).m_exprType.p_EqualsType(dbg_object(this.m_rhs).m_exprType))!=0)){
					err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<147>";
					t_kludge=0;
				}else{
					err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<150>";
					t_kludge=1;
				}
			}else{
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<153>";
				bb_config_InternalErr("Internal error");
			}
		}
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<157>";
	if(bb_config_ENV_LANG==""){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<157>";
		t_kludge=1;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<159>";
	if((t_kludge)!=0){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<160>";
		this.p_FixSideEffects();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<161>";
		this.m_rhs=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,this.m_op.slice(0,-1),this.m_lhs,this.m_rhs)).p_Semant().p_Cast(dbg_object(this.m_lhs).m_exprType,0);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<162>";
		this.m_op="=";
	}
	pop_err();
	return 0;
}
c_AssignStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<75>";
	var t_=(c_AssignStmt.m_new.call(new c_AssignStmt,this.m_op,this.m_lhs.p_Copy(),this.m_rhs.p_Copy()));
	pop_err();
	return t_;
}
function c_ForStmt(){
	c_Stmt.call(this);
	this.m_init=null;
	this.m_expr=null;
	this.m_incr=null;
	this.m_block=null;
}
c_ForStmt.prototype=extend_class(c_Stmt);
c_ForStmt.m_new=function(t_init,t_expr,t_incr,t_block){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<342>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<343>";
	dbg_object(this).m_init=t_init;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<344>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<345>";
	dbg_object(this).m_incr=t_incr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<346>";
	dbg_object(this).m_block=t_block;
	pop_err();
	return this;
}
c_ForStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<336>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<336>";
	pop_err();
	return this;
}
c_ForStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<355>";
	bb_decl_PushEnv(this.m_block);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<357>";
	this.m_init.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<359>";
	this.m_expr=this.m_expr.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<361>";
	bb_decl__loopnest+=1;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<363>";
	this.m_block.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<365>";
	bb_decl__loopnest-=1;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<367>";
	this.m_incr.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<369>";
	bb_decl_PopEnv();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<372>";
	var t_assop=object_downcast((this.m_incr),c_AssignStmt);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<373>";
	var t_addop=object_downcast((dbg_object(t_assop).m_rhs),c_BinaryExpr);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<374>";
	if(!((t_addop)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<374>";
		bb_config_Err("Invalid step expression");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<375>";
	var t_stpval=dbg_object(t_addop).m_rhs.p_Eval();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<376>";
	if(string_startswith(t_stpval,"-")){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<377>";
		var t_bexpr=object_downcast((this.m_expr),c_BinaryExpr);
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<378>";
		var t_=dbg_object(t_bexpr).m_op;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<379>";
		if(t_=="<"){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<379>";
			dbg_object(t_bexpr).m_op=">";
		}else{
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<380>";
			if(t_=="<="){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<380>";
				dbg_object(t_bexpr).m_op=">=";
			}
		}
	}
	pop_err();
	return 0;
}
c_ForStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<350>";
	var t_=(c_ForStmt.m_new.call(new c_ForStmt,this.m_init.p_Copy2(t_scope),this.m_expr.p_Copy(),this.m_incr.p_Copy2(t_scope),this.m_block.p_CopyBlock(t_scope)));
	pop_err();
	return t_;
}
function c_VarExpr(){
	c_Expr.call(this);
	this.m_decl=null;
}
c_VarExpr.prototype=extend_class(c_Expr);
c_VarExpr.m_new=function(t_decl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<217>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<218>";
	dbg_object(this).m_decl=t_decl;
	pop_err();
	return this;
}
c_VarExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<214>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<214>";
	pop_err();
	return this;
}
c_VarExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<230>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<230>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<231>";
	if(!((this.m_decl.p_IsSemanted())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<231>";
		bb_config_Err("Internal error - decl not semanted: "+dbg_object(this.m_decl).m_ident);
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<232>";
	this.m_exprType=dbg_object(this.m_decl).m_type;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<233>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_VarExpr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<222>";
	var t_="VarExpr("+this.m_decl.p_ToString()+")";
	pop_err();
	return t_;
}
c_VarExpr.prototype.p_SideEffects=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<226>";
	pop_err();
	return false;
}
c_VarExpr.prototype.p_SemantSet=function(t_op,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<237>";
	var t_=this.p_Semant();
	pop_err();
	return t_;
}
function c_CatchStmt(){
	c_Stmt.call(this);
	this.m_init=null;
	this.m_block=null;
}
c_CatchStmt.prototype=extend_class(c_Stmt);
c_CatchStmt.m_new=function(t_init,t_block){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<433>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<434>";
	dbg_object(this).m_init=t_init;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<435>";
	dbg_object(this).m_block=t_block;
	pop_err();
	return this;
}
c_CatchStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<428>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<428>";
	pop_err();
	return this;
}
c_CatchStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<443>";
	this.m_init.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<444>";
	if(!((object_downcast((dbg_object(this.m_init).m_type),c_ObjectType))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<444>";
		bb_config_Err("Variable type must extend Throwable");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<445>";
	if(!((dbg_object(this.m_init).m_type.p_GetClass().p_IsThrowable())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<445>";
		bb_config_Err("Variable type must extend Throwable");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<446>";
	this.m_block.p_InsertDecl(this.m_init);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<447>";
	this.m_block.p_Semant();
	pop_err();
	return 0;
}
c_CatchStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<439>";
	var t_=(c_CatchStmt.m_new.call(new c_CatchStmt,object_downcast((this.m_init.p_Copy()),c_LocalDecl),this.m_block.p_CopyBlock(t_scope)));
	pop_err();
	return t_;
}
function c_Stack6(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack6.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_Stack6.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<13>";
	dbg_object(this).m_data=t_data.slice(0);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<14>";
	dbg_object(this).m_length=t_data.length;
	pop_err();
	return this;
}
c_Stack6.prototype.p_Push16=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<55>";
	if(this.m_length==this.m_data.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<56>";
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<58>";
	dbg_array(this.m_data,this.m_length)[dbg_index]=t_value
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<59>";
	this.m_length+=1;
	pop_err();
	return 0;
}
c_Stack6.prototype.p_Push17=function(t_values,t_offset,t_count){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<69>";
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<70>";
		this.p_Push16(dbg_array(t_values,t_offset+t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack6.prototype.p_Push18=function(t_values,t_offset){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<63>";
	for(var t_i=t_offset;t_i<t_values.length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<64>";
		this.p_Push16(dbg_array(t_values,t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack6.prototype.p_Length=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<41>";
	pop_err();
	return this.m_length;
}
c_Stack6.prototype.p_ToArray=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<18>";
	var t_t=new_object_array(this.m_length);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<19>";
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<20>";
		dbg_array(t_t,t_i)[dbg_index]=dbg_array(this.m_data,t_i)[dbg_index]
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<22>";
	pop_err();
	return t_t;
}
function c_TryStmt(){
	c_Stmt.call(this);
	this.m_block=null;
	this.m_catches=[];
}
c_TryStmt.prototype=extend_class(c_Stmt);
c_TryStmt.m_new=function(t_block,t_catches){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<396>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<397>";
	dbg_object(this).m_block=t_block;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<398>";
	dbg_object(this).m_catches=t_catches;
	pop_err();
	return this;
}
c_TryStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<391>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<391>";
	pop_err();
	return this;
}
c_TryStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<410>";
	this.m_block.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<411>";
	for(var t_i=0;t_i<this.m_catches.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<412>";
		dbg_array(this.m_catches,t_i)[dbg_index].p_Semant();
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<413>";
		for(var t_j=0;t_j<t_i;t_j=t_j+1){
			err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<414>";
			if((dbg_object(dbg_object(dbg_array(this.m_catches,t_i)[dbg_index]).m_init).m_type.p_ExtendsType(dbg_object(dbg_object(dbg_array(this.m_catches,t_j)[dbg_index]).m_init).m_type))!=0){
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<415>";
				bb_config_PushErr(dbg_object(dbg_array(this.m_catches,t_i)[dbg_index]).m_errInfo);
				err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<416>";
				bb_config_Err("Catch variable class extends earlier catch variable class");
			}
		}
	}
	pop_err();
	return 0;
}
c_TryStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<402>";
	var t_tcatches=dbg_object(this).m_catches.slice(0);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<403>";
	for(var t_i=0;t_i<t_tcatches.length;t_i=t_i+1){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<404>";
		dbg_array(t_tcatches,t_i)[dbg_index]=object_downcast((dbg_array(t_tcatches,t_i)[dbg_index].p_Copy2(t_scope)),c_CatchStmt)
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<406>";
	var t_=(c_TryStmt.m_new.call(new c_TryStmt,this.m_block.p_CopyBlock(t_scope),t_tcatches));
	pop_err();
	return t_;
}
function c_ThrowStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
}
c_ThrowStmt.prototype=extend_class(c_Stmt);
c_ThrowStmt.m_new=function(t_expr){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<459>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<460>";
	dbg_object(this).m_expr=t_expr;
	pop_err();
	return this;
}
c_ThrowStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<455>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<455>";
	pop_err();
	return this;
}
c_ThrowStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<468>";
	this.m_expr=this.m_expr.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<469>";
	if(!((object_downcast((dbg_object(this.m_expr).m_exprType),c_ObjectType))!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<469>";
		bb_config_Err("Expression type must extend Throwable");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<470>";
	if(!((dbg_object(this.m_expr).m_exprType.p_GetClass().p_IsThrowable())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<470>";
		bb_config_Err("Expression type must extend Throwable");
	}
	pop_err();
	return 0;
}
c_ThrowStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<464>";
	var t_=(c_ThrowStmt.m_new.call(new c_ThrowStmt,this.m_expr.p_Copy()));
	pop_err();
	return t_;
}
function c_ExprStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
}
c_ExprStmt.prototype=extend_class(c_Stmt);
c_ExprStmt.m_new=function(t_expr){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<179>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<180>";
	dbg_object(this).m_expr=t_expr;
	pop_err();
	return this;
}
c_ExprStmt.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<176>";
	c_Stmt.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<176>";
	pop_err();
	return this;
}
c_ExprStmt.prototype.p_OnSemant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<188>";
	this.m_expr=this.m_expr.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<189>";
	if(!((this.m_expr)!=null)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<189>";
		bb_config_InternalErr("Internal error");
	}
	pop_err();
	return 0;
}
c_ExprStmt.prototype.p_OnCopy2=function(t_scope){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/stmt.monkey<184>";
	var t_=(c_ExprStmt.m_new.call(new c_ExprStmt,this.m_expr.p_Copy()));
	pop_err();
	return t_;
}
function bb_parser_ParseSource(t_source,t_app,t_mdecl,t_defattrs,t_options){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1802>";
	var t_toker=c_Toker.m_new.call(new c_Toker,"$SOURCE",t_source);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1804>";
	var t_parser=c_Parser.m_new.call(new c_Parser,t_toker,t_app,t_mdecl,t_defattrs,t_options);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/parser.monkey<1806>";
	t_parser.p_ParseMain();
	pop_err();
	return 0;
}
function bbMain(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<6>";
	bb_config_SetCfgVar("CONFIG","debug");
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<7>";
	bb_config_SetCfgVar("MODPATH",".;/Applications/MonkeyPro70b/modules");
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<8>";
	bb_config_SetCfgVar("ENV_LANG","js");
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<9>";
	bb_config_SetCfgVar("LANG","js");
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<10>";
	bb_config_SetCfgVar("TARGET","html5");
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<11>";
	bb_config_SetCfgVar("HOST","macos");
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<12>";
	bb_config_ENV_HOST="macos";
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<15>";
	var t_options=c_StringList.m_new2.call(new c_StringList);
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<17>";
	t_options.p_AddLast("ignoreModules");
	err_info="/Users/tluyben/Monkey-Interpeter/test.monkey<18>";
	bb_parser_ParseSource("Print 2>1",c_AppDecl.m_new.call(new c_AppDecl),null,0,t_options);
	pop_err();
	return 0;
}
function c_Enumerator3(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator3.m_new=function(t_list){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<308>";
	this.m__list=t_list;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<309>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator3.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<305>";
	pop_err();
	return this;
}
c_Enumerator3.prototype.p_HasNext=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<313>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<314>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<316>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator3.prototype.p_NextObject=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<320>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<321>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<322>";
	pop_err();
	return t_data;
}
function c_List9(){
	Object.call(this);
	this.m__head=(c_HeadNode9.m_new.call(new c_HeadNode9));
}
c_List9.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List9.prototype.p_AddLast9=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<126>";
	var t_=c_Node12.m_new.call(new c_Node12,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List9.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<14>";
		this.p_AddLast9(t_t);
	}
	pop_err();
	return this;
}
c_List9.prototype.p_IsEmpty=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<50>";
	var t_=dbg_object(this.m__head).m__succ==this.m__head;
	pop_err();
	return t_;
}
c_List9.prototype.p_RemoveLast=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<94>";
	if(this.p_IsEmpty()){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<94>";
		error("Illegal operation on empty list");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<96>";
	var t_data=dbg_object(this.m__head.p_PrevNode()).m__data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<97>";
	dbg_object(this.m__head).m__pred.p_Remove();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<98>";
	pop_err();
	return t_data;
}
function c_Node12(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node12.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<243>";
	this.m__succ=t_succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<244>";
	this.m__pred=t_pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<245>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<246>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<247>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node12.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<240>";
	pop_err();
	return this;
}
c_Node12.prototype.p_GetNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<283>";
	pop_err();
	return this;
}
c_Node12.prototype.p_PrevNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<271>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<271>";
		error("Illegal operation on removed node");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<273>";
	var t_=this.m__pred.p_GetNode();
	pop_err();
	return t_;
}
c_Node12.prototype.p_Remove=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<256>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<256>";
		error("Illegal operation on removed node");
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<258>";
	dbg_object(this.m__succ).m__pred=this.m__pred;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<259>";
	dbg_object(this.m__pred).m__succ=this.m__succ;
	pop_err();
	return 0;
}
function c_HeadNode9(){
	c_Node12.call(this);
}
c_HeadNode9.prototype=extend_class(c_Node12);
c_HeadNode9.m_new=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<292>";
	c_Node12.m_new2.call(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<293>";
	this.m__succ=(this);
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<294>";
	this.m__pred=(this);
	pop_err();
	return this;
}
c_HeadNode9.prototype.p_GetNode=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<298>";
	pop_err();
	return null;
}
function c_MapValues(){
	Object.call(this);
	this.m_map=null;
}
c_MapValues.m_new=function(t_map){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<519>";
	dbg_object(this).m_map=t_map;
	pop_err();
	return this;
}
c_MapValues.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<516>";
	pop_err();
	return this;
}
c_MapValues.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<523>";
	var t_=c_ValueEnumerator.m_new.call(new c_ValueEnumerator,this.m_map.p_FirstNode());
	pop_err();
	return t_;
}
function c_ValueEnumerator(){
	Object.call(this);
	this.m_node=null;
}
c_ValueEnumerator.m_new=function(t_node){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<481>";
	dbg_object(this).m_node=t_node;
	pop_err();
	return this;
}
c_ValueEnumerator.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<478>";
	pop_err();
	return this;
}
c_ValueEnumerator.prototype.p_HasNext=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<485>";
	var t_=this.m_node!=null;
	pop_err();
	return t_;
}
c_ValueEnumerator.prototype.p_NextObject=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<489>";
	var t_t=this.m_node;
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<490>";
	this.m_node=this.m_node.p_NextNode();
	err_info="/Applications/MonkeyPro70b/modules/monkey/map.monkey<491>";
	pop_err();
	return dbg_object(t_t).m_value;
}
function c_Enumerator4(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator4.m_new=function(t_list){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<308>";
	this.m__list=t_list;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<309>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator4.m_new2=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<305>";
	pop_err();
	return this;
}
c_Enumerator4.prototype.p_HasNext=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<313>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<314>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<316>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator4.prototype.p_NextObject=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<320>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<321>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="/Applications/MonkeyPro70b/modules/monkey/list.monkey<322>";
	pop_err();
	return t_data;
}
function c_InvokeExpr(){
	c_Expr.call(this);
	this.m_decl=null;
	this.m_args=[];
}
c_InvokeExpr.prototype=extend_class(c_Expr);
c_InvokeExpr.m_new=function(t_decl,t_args){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<294>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<295>";
	dbg_object(this).m_decl=t_decl;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<296>";
	dbg_object(this).m_args=t_args;
	pop_err();
	return this;
}
c_InvokeExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<290>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<290>";
	pop_err();
	return this;
}
c_InvokeExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<308>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<308>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<309>";
	this.m_exprType=dbg_object(this.m_decl).m_retType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<310>";
	this.m_args=this.p_CastArgs(this.m_args,this.m_decl);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<311>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_InvokeExpr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<300>";
	var t_t="InvokeExpr("+this.m_decl.p_ToString();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<301>";
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<301>";
	var t_=this.m_args;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<301>";
	var t_2=0;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<301>";
	while(t_2<t_.length){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<301>";
		var t_arg=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<301>";
		t_2=t_2+1;
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<302>";
		t_t=t_t+(","+t_arg.p_ToString());
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<304>";
	var t_3=t_t+")";
	pop_err();
	return t_3;
}
function c_StmtExpr(){
	c_Expr.call(this);
	this.m_stmt=null;
	this.m_expr=null;
}
c_StmtExpr.prototype=extend_class(c_Expr);
c_StmtExpr.m_new=function(t_stmt,t_expr){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<127>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<128>";
	dbg_object(this).m_stmt=t_stmt;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<129>";
	dbg_object(this).m_expr=t_expr;
	pop_err();
	return this;
}
c_StmtExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<123>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<123>";
	pop_err();
	return this;
}
c_StmtExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<141>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<141>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<143>";
	this.m_stmt.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<144>";
	this.m_expr=this.m_expr.p_Semant();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<145>";
	this.m_exprType=dbg_object(this.m_expr).m_exprType;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<146>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_StmtExpr.prototype.p_Copy=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<133>";
	var t_=(c_StmtExpr.m_new.call(new c_StmtExpr,this.m_stmt,this.p_CopyExpr(this.m_expr)));
	pop_err();
	return t_;
}
c_StmtExpr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<137>";
	var t_="StmtExpr(,"+this.m_expr.p_ToString()+")";
	pop_err();
	return t_;
}
function c_MemberVarExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_decl=null;
}
c_MemberVarExpr.prototype=extend_class(c_Expr);
c_MemberVarExpr.m_new=function(t_expr,t_decl){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<256>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<257>";
	dbg_object(this).m_expr=t_expr;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<258>";
	dbg_object(this).m_decl=t_decl;
	pop_err();
	return this;
}
c_MemberVarExpr.m_new2=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<252>";
	c_Expr.m_new.call(this);
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<252>";
	pop_err();
	return this;
}
c_MemberVarExpr.prototype.p_Semant=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<270>";
	if((this.m_exprType)!=null){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<270>";
		var t_=(this);
		pop_err();
		return t_;
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<271>";
	if(!((this.m_decl.p_IsSemanted())!=0)){
		err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<271>";
		bb_config_InternalErr("Internal error");
	}
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<272>";
	this.m_exprType=dbg_object(this.m_decl).m_type;
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<273>";
	var t_2=(this);
	pop_err();
	return t_2;
}
c_MemberVarExpr.prototype.p_ToString=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<262>";
	var t_="MemberVarExpr("+this.m_expr.p_ToString()+","+this.m_decl.p_ToString()+")";
	pop_err();
	return t_;
}
c_MemberVarExpr.prototype.p_SideEffects=function(){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<266>";
	var t_=this.m_expr.p_SideEffects();
	pop_err();
	return t_;
}
c_MemberVarExpr.prototype.p_SemantSet=function(t_op,t_rhs){
	push_err();
	err_info="/Users/tluyben/Monkey-Interpeter/trans/expr.monkey<277>";
	var t_=this.p_Semant();
	pop_err();
	return t_;
}
function c_Stack7(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack7.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_Stack7.m_new2=function(t_data){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<13>";
	dbg_object(this).m_data=t_data.slice(0);
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<14>";
	dbg_object(this).m_length=t_data.length;
	pop_err();
	return this;
}
c_Stack7.prototype.p_Push19=function(t_value){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<55>";
	if(this.m_length==this.m_data.length){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<56>";
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<58>";
	dbg_array(this.m_data,this.m_length)[dbg_index]=t_value
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<59>";
	this.m_length+=1;
	pop_err();
	return 0;
}
c_Stack7.prototype.p_Push20=function(t_values,t_offset,t_count){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<69>";
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<70>";
		this.p_Push19(dbg_array(t_values,t_offset+t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack7.prototype.p_Push21=function(t_values,t_offset){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<63>";
	for(var t_i=t_offset;t_i<t_values.length;t_i=t_i+1){
		err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<64>";
		this.p_Push19(dbg_array(t_values,t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack7.prototype.p_Length=function(){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<41>";
	pop_err();
	return this.m_length;
}
c_Stack7.prototype.p_Get2=function(t_index){
	push_err();
	err_info="/Applications/MonkeyPro70b/modules/monkey/stack.monkey<90>";
	var t_=dbg_array(this.m_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
var bb_decl__loopnest=0;
var bb_config_ENV_LANG="";
var bb_config_ENV_CONFIG="";
function bbInit(){
	bb_config__cfgVars=c_StringMap.m_new.call(new c_StringMap);
	bb_config_ENV_HOST="";
	bb_config__errInfo="";
	c_Toker.m__keywords=null;
	c_Toker.m__symbols=null;
	bb_parser_FILE_EXT="monkey";
	c_Type.m_boolType=c_BoolType.m_new.call(new c_BoolType);
	c_Type.m_stringType=c_StringType.m_new.call(new c_StringType);
	bb_decl__env=null;
	bb_decl__envStack=c_List4.m_new.call(new c_List4);
	c_Type.m_voidType=c_VoidType.m_new.call(new c_VoidType);
	c_Type.m_emptyArrayType=c_ArrayType.m_new.call(new c_ArrayType,(c_Type.m_voidType));
	c_Type.m_intType=c_IntType.m_new.call(new c_IntType);
	c_Type.m_floatType=c_FloatType.m_new.call(new c_FloatType);
	c_Type.m_objectType=c_IdentType.m_new.call(new c_IdentType,"monkey.object",[]);
	c_Type.m_throwableType=c_IdentType.m_new.call(new c_IdentType,"monkey.throwable",[]);
	c_Type.m_nullObjectType=c_IdentType.m_new.call(new c_IdentType,"",[]);
	bb_config__errStack=c_StringList.m_new2.call(new c_StringList);
	bb_config_ENV_SAFEMODE=0;
	c_ClassDecl.m_nullObjectClass=c_ClassDecl.m_new.call(new c_ClassDecl,"{NULL}",1280,[],null,[]);
	bb_decl__loopnest=0;
	bb_config_ENV_LANG="";
	bb_config_ENV_CONFIG="";
}
//${TRANSCODE_END}
