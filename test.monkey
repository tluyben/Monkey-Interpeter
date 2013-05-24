Import trans
Import os
Global LANG$="js"

Function Main() 
	SetCfgVar "CONFIG", "debug"
	SetCfgVar "MODPATH", ".;/Applications/MonkeyPro70b/modules"
	SetCfgVar "ENV_LANG", "js"
	SetCfgVar "LANG", "js"
	SetCfgVar "TARGET", "html5"
	SetCfgVar "HOST", "macos"
	ENV_HOST="macos"
	'HOST=HostOS

	Local options := New StringList()
	
	options.AddLast("ignoreModules");
	ParseSource("Print 2>1", New AppDecl(), Null, 0, options)'.Semant

	
End