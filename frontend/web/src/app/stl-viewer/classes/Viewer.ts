
import { Matrix3x4 } from "./Matrix";
import { PlatformInfo } from "./PlatformInfo";
import { Material } from "./Material";
import { Texture } from "./Texture";
import { PickInfo } from "./PickInfo";
import { LoaderSelector } from "./LoaderSelector";
import { Math3D } from "./Math3D";
import { WebGLRenderBackend } from "./WebGLRenderBackend";

/**
@class Viewer

Viewer is the main class of JSC3D. It provides presentation of and interaction with a simple static 3D scene
which can either be given as the url of the scene file, or be manually constructed and passed in. It
also provides some settings to adjust the mode and quality of the rendering.<br /><br />

Viewer should be constructed with an existing canvas object where to perform the rendering.<br /><br />

Viewer provides 3 way to specify the scene:<br />
1. Use setParameter() method before initilization and set 'SceneUrl' parameter with a valid url
that describes where to load the scene. <br />
2. Use replaceSceneFromUrl() method, passing in a valid url to load/replace scene at runtime.<br />
3. Use replaceScene() method, passing in a manually constructed scene object to replace the current one
at runtime.<br />
*/

export class Viewer {
    loader = null;

    canvas = null;
    ctx2d = null;
    canvasData = null;
    bkgColorBuffer = null;
    colorBuffer = null;
    zBuffer = null;
    selectionBuffer = null;
    frameWidth = null;
    frameHeight = null;
    scene = null;
    defaultMaterial = null;
    sphereMap = null;
    isLoaded = false;
    isFailed = false;
    abortUnfinishedLoadingFn = null;
    needUpdate = false;
    needRepaint = false;
    initRotX = 0;
    initRotY = 0;
    initRotZ = 0;
    zoomFactor = 1;
    panning = [0, 0];
    rotMatrix = null;
    transformMatrix = null;
    sceneUrl = '';
    modelColor = 0xcaa618;
    bkgColor1 = 0xffffff;
    bkgColor2 = 0x383840;
    bkgImageUrl = '';
    bkgImage = null;
    isBackgroundOn = true;
    renderMode = 'flat';
    definition = 'standard';
    isCullingDisabled = false;
    isMipMappingOn = false;
    creaseAngle = -180;
    sphereMapUrl = '';
    showProgressBar = true;
    buttonStates = {};
    keyStates = {};
    mouseX = 0;
    mouseY = 0;
    mouseDownX = -1;
    mouseDownY = -1;
    isTouchHeld = false;
    baseZoomFactor = 1;
    suppressDraggingRotation = false;
    progressFrame = null;
    progressRectangle = null;
    messagePanel = null;
    webglBackend = null;
    platformInfo = new PlatformInfo();

    useWebGL = null;
    releaseLocalBuffers = null;
    params = null;

    /**
     * {Function} A callback function that will be invoked as soon as a new loading is started.
     */
    onloadingstarted = null;
    /**
     * {Function} A callback function that will be invoked when the previous loading finished successfully.
     */
    onloadingcomplete = null;
    /**
     * {Function} A callback function that will be invoked 0, once or several times as a loading is in progress.
     */
    onloadingprogress = null;
    /**
     * {Function} A callback function that will be invoked when the previous loading has been aborted.
     */
    onloadingaborted = null;
    /**
     * {Function} A callback function that will be invoked when error occurs in loading.
     */
    onloadingerror = null;
    /**
     * {Function} A callback function that will be invoked when there is a mousedown event on the canvas.
     */
    onmousedown = null;
    /**
     * {Function} A callback function that will be invoked when there is a mouseup event on the canvas.
     */
    onmouseup = null;
    /**
     * {Function} A callback function that will be invoked when there is a mousemove event on the canvas.
     */
    onmousemove = null;
    /**
     * {Function} A callback function that will be invoked when there is a mousewheel event on the canvas.
     */
    onmousewheel = null;
    /**
     * {Function} A callback function that will be invoked when there is a mouseclick event on the canvas.
     */
    onmouseclick = null;
    /**
     * {Function} A callback function that will be invoked before each update.
     */
    beforeupdate = null;
    /**
     * {Function} A callback function that will be invoked after each update.
     */
    afterupdate = null;
    mouseUsage = 'default';
    isDefaultInputHandlerEnabled = false;



    constructor(canvas, parameters) {
        if(parameters)
            this.params = {
                SceneUrl:			parameters.SceneUrl || '',
                InitRotationX:		parameters.InitRotationX || 0,
                InitRotationY:		parameters.InitRotationY || 0,
                InitRotationZ:		parameters.InitRotationZ || 0,
                ModelColor:			parameters.ModelColor || '#caa618',
                BackgroundColor1:	parameters.BackgroundColor1 || '#ffffff',
                BackgroundColor2:	parameters.BackgroundColor2 || '#383840',
                BackgroundImageUrl:	parameters.BackgroundImageUrl || '',
                Background:			parameters.Background || 'on',
                RenderMode:			parameters.RenderMode || 'flat',
                Definition:			parameters.Definition || 'standard',
                FaceCulling:		parameters.FaceCulling || 'on',
                MipMapping:			parameters.MipMapping || 'off',
                CreaseAngle:		parameters.CreaseAngle || -180,
                SphereMapUrl:		parameters.SphereMapUrl || '',
                ProgressBar:		parameters.ProgressBar || 'on',
                Renderer:			parameters.Renderer || '',
                LocalBuffers:		parameters.LocalBuffers || 'retain'
            };
        else
            this.params = {
                SceneUrl: '',
                InitRotationX: 0,
                InitRotationY: 0,
                InitRotationZ: 0,
                ModelColor: '#caa618',
                BackgroundColor1: '#ffffff',
                BackgroundColor2: '#383840',
                BackgroundImageUrl: '',
                Background: 'on',
                RenderMode: 'flat',
                Definition: 'standard',
                FaceCulling: 'on',
                MipMapping: 'off',
                CreaseAngle: -180,
                SphereMapUrl: '',
                ProgressBar: 'on',
                Renderer: '',
                LocalBuffers: 'retain'
            };


        this.canvas = canvas;
        this.ctx2d = null;
        this.canvasData = null;
        this.bkgColorBuffer = null;
        this.colorBuffer = null;
        this.zBuffer = null;
        this.selectionBuffer = null;
        this.frameWidth = canvas.width;
        this.frameHeight = canvas.height;
        this.scene = null;
        this.defaultMaterial = null;
        this.sphereMap = null;
        this.isLoaded = false;
        this.isFailed = false;
        this.abortUnfinishedLoadingFn = null;
        this.needUpdate = false;
        this.needRepaint = false;
        this.initRotX = 0;
        this.initRotY = 0;
        this.initRotZ = 0;
        this.zoomFactor = 1;
        this.panning = [0, 0];
        this.rotMatrix = new Matrix3x4;
        this.transformMatrix = new Matrix3x4;
        this.sceneUrl = '';
        this.modelColor = 0xcaa618;
        this.bkgColor1 = 0xffffff;
        this.bkgColor2 = 0x383840;
        this.bkgImageUrl = '';
        this.bkgImage = null;
        this.isBackgroundOn = true;
        this.renderMode = 'flat';
        this.definition = 'standard';
        this.isCullingDisabled = false;
        this.isMipMappingOn = false;
        this.creaseAngle = -180;
        this.sphereMapUrl = '';
        this.showProgressBar = true;
        this.buttonStates = {};
        this.keyStates = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDownX = -1;
        this.mouseDownY = -1;
        this.isTouchHeld = false;
        this.baseZoomFactor = 1;
        this.suppressDraggingRotation = false;
        this.onloadingstarted = null;
        this.onloadingcomplete = null;
        this.onloadingprogress = null;
        this.onloadingaborted = null;
        this.onloadingerror = null;
        this.onmousedown = null;
        this.onmouseup = null;
        this.onmousemove = null;
        this.onmousewheel = null;
        this.onmouseclick = null;
        this.beforeupdate = null;
        this.afterupdate = null;
        this.mouseUsage = 'default';
        this.isDefaultInputHandlerEnabled = true;
        this.progressFrame = null;
        this.progressRectangle = null;
        this.messagePanel = null;
        this.webglBackend = null;
        
        

        // setup input handlers.
        // compatibility for touch devices is taken into account
        var self = this;
        if(!this.platformInfo.isTouchDevice) {
            this.canvas.addEventListener('mousedown', function(e){self.mouseDownHandler(e);}, false);
            this.canvas.addEventListener('mouseup', function(e){self.mouseUpHandler(e);}, false);
            this.canvas.addEventListener('mousemove', function(e){self.mouseMoveHandler(e);}, false);
            this.canvas.addEventListener(this.platformInfo.browser == 'firefox' ? 'DOMMouseScroll' : 'mousewheel',
                                        function(e){self.mouseWheelHandler(e);}, false);
            document.addEventListener('keydown', function(e){self.keyDownHandler(e);}, false);
            document.addEventListener('keyup', function(e){self.keyUpHandler(e);}, false);
        }
        else {
            this.canvas.addEventListener('touchstart', function(e){self.touchStartHandler(e);}, false);
            this.canvas.addEventListener('touchend', function(e){self.touchEndHandler(e);}, false);
            this.canvas.addEventListener('touchmove', function(e){self.touchMoveHandler(e);}, false);
        }
    };

    /**
        Set the initial value for a parameter to parameterize the viewer.<br />
        Available parameters are:<br />
        '<b>SceneUrl</b>':				URL string that describes where to load the scene, default to '';<br />
        '<b>InitRotationX</b>':			initial rotation angle around x-axis for the whole scene, default to 0;<br />
        '<b>InitRotationY</b>':			initial rotation angle around y-axis for the whole scene, default to 0;<br />
        '<b>InitRotationZ</b>':			initial rotation angle around z-axis for the whole scene, default to 0;<br />
        '<b>CreaseAngle</b>':			an angle to control the shading smoothness between faces. Two adjacent faces will be shaded with discontinuity at the edge if the angle between their normals exceeds this value. Not used by default;<br />
        '<b>ModelColor</b>':			fallback color for all meshes, default to '#caa618';<br />
        '<b>BackgroundColor1</b>':		color at the top of the background, default to '#ffffff';<br />
        '<b>BackgroundColor2</b>':		color at the bottom of the background, default to '#383840';<br />
        '<b>BackgroundImageUrl</b>':	URL string that describes where to load the image used for background, default to '';<br />
        '<b>Background</b>':			turn on/off rendering of background. If this is set to 'off', the background area will be transparent. Default to 'on';<br />
        '<b>RenderMode</b>':			render mode, default to 'flat';<br />
        '<b>FaceCulling</b>':			turn on/off back-face culling for all meshes, default to 'on';<br />
        '<b>Definition</b>':			quality level of rendering, default to 'standard';<br />
        '<b>MipMapping</b>':			turn on/off mip-mapping, default to 'off';<br />
        '<b>SphereMapUrl</b>':			URL string that describes where to load the image used for sphere mapping, default to '';<br />
        '<b>ProgressBar</b>':			turn on/off the progress bar when loading, default to 'on'. By turning off the default progress bar, a user defined loading indicator can be used instead;<br />
        '<b>Renderer</b>':				set to 'webgl' to enable WebGL for rendering, default to ''.
        @param {String} name name of the parameter to set.
        @param value new value for the parameter.
    */
    setParameter(name, value) {
        this.params[name] = value;
    };

    setLoader(loader) {
        this.loader = loader;
    }

    /**
        Initialize viewer for rendering and interactions.
    */
    init() {
        this.sceneUrl = this.params['SceneUrl'];
        this.initRotX = parseFloat(this.params['InitRotationX']);
        this.initRotY = parseFloat(this.params['InitRotationY']);
        this.initRotZ = parseFloat(this.params['InitRotationZ']);
        this.modelColor = parseInt('0x' + this.params['ModelColor'].substring(1));
        this.bkgColor1 = parseInt('0x' + this.params['BackgroundColor1'].substring(1));
        this.bkgColor2 = parseInt('0x' + this.params['BackgroundColor2'].substring(1));
        this.bkgImageUrl = this.params['BackgroundImageUrl'];
        this.isBackgroundOn = this.params['Background'].toLowerCase() == 'on';
        this.renderMode = this.params['RenderMode'].toLowerCase();
        this.definition = this.params['Definition'].toLowerCase();
        this.isCullingDisabled = this.params['FaceCulling'].toLowerCase() == 'off';
        this.creaseAngle = parseFloat(this.params['CreaseAngle']);
        this.isMipMappingOn = this.params['MipMapping'].toLowerCase() == 'on';
        this.sphereMapUrl = this.params['SphereMapUrl'];
        this.showProgressBar = this.params['ProgressBar'].toLowerCase() == 'on';
        this.useWebGL = this.params['Renderer'].toLowerCase() == 'webgl';
        this.releaseLocalBuffers = this.params['LocalBuffers'].toLowerCase() == 'release';

        // Create WebGL render back-end if it is assigned to.
        try {
            this.webglBackend = new WebGLRenderBackend(this.canvas, this.releaseLocalBuffers);
        } catch(e){}

        if(this.canvas.width <= 2 || this.canvas.height <= 2)
            this.definition = 'standard';

        // calculate dimensions of frame buffers
        switch(this.definition) {
        case 'low':
            this.frameWidth = ~~((this.canvas.width + 1) / 2);
            this.frameHeight = ~~((this.canvas.height + 1) / 2);
            break;
        case 'high':
            this.frameWidth = this.canvas.width * 2;
            this.frameHeight = this.canvas.height * 2;
            break;
        case 'standard':
        default:
            this.frameWidth = this.canvas.width;
            this.frameHeight = this.canvas.height;
            break;
        }

        // initialize states
        this.zoomFactor = 1;
        this.panning = [0, 0];
        this.rotMatrix.identity();
        this.transformMatrix.identity();
        this.isLoaded = false;
        this.isFailed = false;
        this.needUpdate = false;
        this.needRepaint = false;
        this.scene = null;

        // create a default material to render meshes that don't have one
        this.defaultMaterial = new Material('default', undefined, this.modelColor, 0, true);

        // apply background
        this.generateBackground();
        this.drawBackground();

        // wake up update routine per 30 milliseconds
        var self = this;
        (function tick() {
            self.doUpdate();
            setTimeout(tick, 30);
        }) ();

        // load background image if any
        this.setBackgroudImageFromUrl(this.bkgImageUrl);

        // load scene if any
        this.loadScene();

        // load sphere mapping image if any
        this.setSphereMapFromUrl(this.sphereMapUrl);
    };

    /**
        Ask viewer to render a new frame or just repaint last frame.
        @param {Boolean} repaintOnly true to repaint last frame; false(default) to render a new frame.
    */
    update(repaintOnly = false) {
        if(this.isFailed)
            return;

        if(repaintOnly)
            this.needRepaint = true;
        else
            this.needUpdate = true;
    };

    /**
        Rotate the scene with given angles around Cardinal axes.
        @param {Number} rotX rotation angle around X-axis in degrees.
        @param {Number} rotY rotation angle around Y-axis in degrees.
        @param {Number} rotZ rotation angle around Z-axis in degrees.
    */
    rotate(rotX, rotY, rotZ) {
        this.rotMatrix.rotateAboutXAxis(rotX);
        this.rotMatrix.rotateAboutYAxis(rotY);
        this.rotMatrix.rotateAboutZAxis(rotZ);
    };

    /**
        Set render mode.<br />
        Available render modes are:<br />
        '<b>point</b>':         render meshes as point clouds;<br />
        '<b>wireframe</b>':     render meshes as wireframe;<br />
        '<b>flat</b>':          render meshes as solid objects using flat shading;<br />
        '<b>smooth</b>':        render meshes as solid objects using smooth shading;<br />
        '<b>texture</b>':       render meshes as solid textured objects, no lighting will be apllied;<br />
        '<b>textureflat</b>':   render meshes as solid textured objects, lighting will be calculated per face;<br />
        '<b>texturesmooth</b>': render meshes as solid textured objects, lighting will be calculated per vertex and interpolated.<br />
        @param {String} mode new render mode.
    */
    setRenderMode(mode) {
        this.params['RenderMode'] = mode;
        this.renderMode = mode;
    };

    /**
        Set quality level of rendering.<br />
        Available quality levels are:<br />
        '<b>low</b>':      low-quality rendering will be applied, with highest performance;<br />
        '<b>standard</b>': normal-quality rendering will be applied, with modest performace;<br />
        '<b>high</b>':     high-quality rendering will be applied, with lowest performace.<br />
        @params {String} definition new quality level.
    */
    setDefinition(definition) {
        if(this.canvas.width <= 2 || this.canvas.height <= 2)
            definition = 'standard';

        if(definition == this.definition)
            return;

        this.params['Definition'] = definition;
        this.definition = definition;

        var oldFrameWidth = this.frameWidth;

        switch(this.definition) {
        case 'low':
            this.frameWidth = ~~((this.canvas.width + 1) / 2);
            this.frameHeight = ~~((this.canvas.height + 1) / 2);
            break;
        case 'high':
            this.frameWidth = this.canvas.width * 2;
            this.frameHeight = this.canvas.height * 2;
            break;
        case 'standard':
        default:
            this.frameWidth = this.canvas.width;
            this.frameHeight = this.canvas.height;
            break;
        }

        var ratio = this.frameWidth / oldFrameWidth;
        // zoom factor should be adjusted, otherwise there would be an abrupt zoom-in or zoom-out on next frame
        this.zoomFactor *= ratio;
        // likewise, panning should also be adjusted to avoid abrupt jump on next frame
        this.panning[0] *= ratio;
        this.panning[1] *= ratio;
    };

    /**
        Specify the url for the background image.
        @param {String} backgroundImageUrl url string for the background image.
    */
    setBackgroudImageFromUrl(backgroundImageUrl) {
        this.params['BackgroundImageUrl'] = backgroundImageUrl;
        this.bkgImageUrl = backgroundImageUrl;

        if(backgroundImageUrl == '') {
            this.bkgImage = null;
            return;
        }

        var self = this;
        var img = new Image;

        img.onload = function() {
            self.bkgImage = this;
            self.generateBackground();
        };

        img.crossOrigin = 'anonymous'; // explicitly enable cross-domain image
        img.src = encodeURI(backgroundImageUrl);
    };

    /**
        Specify a new image from the given url which will be used for applying sphere mapping.
        @param {String} sphereMapUrl url string that describes where to load the image.
    */
    setSphereMapFromUrl(sphereMapUrl) {
        this.params['SphereMapUrl'] = sphereMapUrl;
        this.sphereMapUrl = sphereMapUrl;

        if(sphereMapUrl == '') {
            this.sphereMap = null;
            return;
        }

        var self = this;
        var newMap = new Texture(null, null);

        newMap.onready = function() {
            self.sphereMap = newMap;
            self.update();
        };

        newMap.createFromUrl(this.sphereMapUrl, null);
    };

    /**
        Enable/Disable the default mouse and key event handling routines.
        @param {Boolean} enabled true to enable the default handler; false to disable them.
    */
    enableDefaultInputHandler(enabled) {
        this.isDefaultInputHandlerEnabled = enabled;
    };

    /**
        Set control of mouse pointer.
        Available options are:<br />
        '<b>default</b>':	default mouse control will be used;<br />
        '<b>free</b>':		this tells {JSC3D.Viewer} a user-defined mouse control will be adopted.
                            This is often used together with viewer.enableDefaultInputHandler(false)
                            and viewer.onmousedown, viewer.onmouseup and/or viewer.onmousemove overridden.<br />
        '<b>rotate</b>':	mouse will be used to rotate the scene;<br />
        '<b>zoom</b>':		mouse will be used to do zooming.<br />
        '<b>pan</b>':		mouse will be used to do panning.<br />
        @param {String} usage control of mouse pointer to be set.
        @deprecated This method is obsolete since version 1.5.0 and may be removed in the future.
    */
    setMouseUsage(usage) {
        this.mouseUsage = usage;
    };

    /**
        Check if WebGL is enabled for rendering.
        @returns {Boolean} true if WebGL is enabled; false if WebGL is not enabled or unavailable.
    */
    isWebGLEnabled() {
        return this.webglBackend != null;
    };

    /**
        Load a new scene from the given url to replace the current scene.
        @param {String} sceneUrl url string that describes where to load the new scene.
    */
    replaceSceneFromUrl(sceneUrl) {
        this.params['SceneUrl'] = sceneUrl;
        this.sceneUrl = sceneUrl;
        this.isFailed = this.isLoaded = false;
        this.loadScene();
    };

    /**
        Replace the current scene with a given scene.
        @param {JSC3D.Scene} scene the given scene.
    */
    replaceScene(scene) {
        this.params['SceneUrl'] = '';
        this.sceneUrl = '';
        this.isFailed = false;
        this.isLoaded = true;
        this.setupScene(scene);
    };

    /**
        Reset the current scene to its initial state.
    */
    resetScene() {
        var d = (!this.scene || this.scene.isEmpty()) ? 0 : this.scene.aabb.lengthOfDiagonal();
        this.zoomFactor = (d == 0) ? 1 : (this.frameWidth < this.frameHeight ? this.frameWidth : this.frameHeight) / d;
        this.panning = [0, 0];
        this.rotMatrix.identity();
        this.rotMatrix.rotateAboutXAxis(this.initRotX);
        this.rotMatrix.rotateAboutYAxis(this.initRotY);
        this.rotMatrix.rotateAboutZAxis(this.initRotZ);
    };

    /**
        Get the current scene.
        @returns {JSC3D.Scene} the current scene.
    */
    getScene() {
        return this.scene;
    };

    /**
        Query information at a given position on the canvas.
        @param {Number} clientX client x coordinate on the current page.
        @param {Number} clientY client y coordinate on the current page.
        @returns {JSC3D.PickInfo} a PickInfo object which holds the result.
    */
    pick(clientX, clientY) {
        var pickInfo = new PickInfo;

        var canvasRect = this.canvas.getBoundingClientRect();
        var canvasX = clientX - canvasRect.left;
        var canvasY = clientY - canvasRect.top;

        pickInfo.canvasX = canvasX;
        pickInfo.canvasY = canvasY;

        var pickedId = 0;
        pickedId = this.webglBackend.pick(canvasX, canvasY);

        if(pickedId > 0) {
            var meshes = this.scene.getChildren();
            for(var i=0; i<meshes.length; i++) {
                if(meshes[i].internalId == pickedId) {
                    pickInfo.mesh = meshes[i];
                    break;
                }
            }
        }

        return pickInfo;
    };

    /**
        Render a new frame or repaint last frame.
        @private
    */
    doUpdate() {
        if(this.needUpdate || this.needRepaint) {
            if(this.beforeupdate != null && (typeof this.beforeupdate) == 'function')
                this.beforeupdate();

            if(this.scene) {
                /*
                * Render a new frame or just redraw last frame.
                */
                if(this.needUpdate) {
                    this.beginScene();
                    this.render();
                    this.endScene();
                }
                this.paint();
            }
            else {
                // Only need to redraw the background since there is nothing to render.
                this.drawBackground();
            }

            // clear dirty flags
            this.needRepaint = false;
            this.needUpdate = false;

            if(this.afterupdate != null && (typeof this.afterupdate) == 'function')
                this.afterupdate();
        }
    };

    /**
        Paint onto canvas.
        @private
    */
    paint() {
        return;
    };

    /**
        The mouseDown event handling routine.
        @private
    */
    mouseDownHandler(e) {
        if(!this.isLoaded)
            return;

        if(this.onmousedown) {
            var info = this.pick(e.clientX, e.clientY);
            this.onmousedown(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
        }

        e.preventDefault();
        e.stopPropagation();

        if(!this.isDefaultInputHandlerEnabled)
            return;

        this.buttonStates[e.button] = true;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.mouseDownX = e.clientX;
        this.mouseDownY = e.clientY;
    };

    /**
        The mouseUp event handling routine.
        @private
    */
    mouseUpHandler(e) {
        if(!this.isLoaded)
            return;

        var info;
        if(this.onmouseup || this.onmouseclick) {
            info = this.pick(e.clientX, e.clientY);
        }

        if(this.onmouseup) {
            this.onmouseup(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
        }

        if(this.onmouseclick && this.mouseDownX == e.clientX && this.mouseDownY == e.clientY) {
            this.onmouseclick(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
            this.mouseDownX = -1;
            this.mouseDownY = -1;
        }

        e.preventDefault();
        e.stopPropagation();

        if(!this.isDefaultInputHandlerEnabled)
            return;

        this.buttonStates[e.button] = false;
    };

    /**
        The mouseMove event handling routine.
        @private
    */
    mouseMoveHandler(e) {
        if(!this.isLoaded)
            return;

        if(this.onmousemove) {
            var info = this.pick(e.clientX, e.clientY);
            this.onmousemove(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
        }

        e.preventDefault();
        e.stopPropagation();

        if(!this.isDefaultInputHandlerEnabled)
            return;

        var isDragging = this.buttonStates[0] == true;
        var isShiftDown = this.keyStates[0x10] == true;
        var isCtrlDown = this.keyStates[0x11] == true;
        if(isDragging) {
            if((isShiftDown && this.mouseUsage == 'default') || this.mouseUsage == 'zoom') {
                this.zoomFactor *= this.mouseY <= e.clientY ? 1.04 : 0.96;
            }
            else if((isCtrlDown && this.mouseUsage == 'default') || this.mouseUsage == 'pan') {
                var ratio = (this.definition == 'low') ? 0.5 : ((this.definition == 'high') ? 2 : 1);
                this.panning[0] += ratio * (e.clientX - this.mouseX);
                this.panning[1] += ratio * (e.clientY - this.mouseY);
            }
            else if(this.mouseUsage == 'default' || this.mouseUsage == 'rotate') {
                var rotX = (e.clientY - this.mouseY) * 360 / this.canvas.width;
                var rotY = (e.clientX - this.mouseX) * 360 / this.canvas.height;
                this.rotMatrix.rotateAboutXAxis(rotX);
                this.rotMatrix.rotateAboutYAxis(rotY);
            }
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.mouseDownX = -1;
            this.mouseDownY = -1;
            this.update();
        }
    };

    mouseWheelHandler(e) {
        if(!this.isLoaded)
            return;

        if(this.onmousewheel) {
            var info = this.pick(e.clientX, e.clientY);
            this.onmousewheel(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
        }

        e.preventDefault();
        e.stopPropagation();

        if(!this.isDefaultInputHandlerEnabled)
            return;

        this.mouseDownX = -1;
        this.mouseDownY = -1;

        this.zoomFactor *= (this.platformInfo.browser == 'firefox' ? -e.detail : e.wheelDelta) < 0 ? 1.1 : 0.91;
        this.update();
    };

    /**
        The touchStart event handling routine. This is for compatibility for touch devices.
        @private
    */
    touchStartHandler(e) {
        if(!this.isLoaded)
            return;

        if(e.touches.length > 0) {
            var clientX = e.touches[0].clientX;
            var clientY = e.touches[0].clientY;

            if(this.onmousedown) {
                var info = this.pick(clientX, clientY);
                this.onmousedown(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            }

            e.preventDefault();
            e.stopPropagation();

            if(!this.isDefaultInputHandlerEnabled)
                return;

            this.buttonStates[0] = true;
            this.mouseX = clientX;
            this.mouseY = clientY;
            this.mouseDownX = clientX;
            this.mouseDownY = clientY;
        }
    };

    /**
        The touchEnd event handling routine. This is for compatibility for touch devices.
        @private
    */
    touchEndHandler(e) {
        if(!this.isLoaded)
            return;

        var info;
        if(this.onmouseup || this.onmouseclick) {
            info = this.pick(this.mouseX, this.mouseY);
        }

        if(this.onmouseup) {
            this.onmouseup(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
        }

        if(this.onmouseclick && this.mouseDownX == e.touches[0].clientX && this.mouseDownY == e.touches[0].clientY) {
            this.onmouseclick(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            this.mouseDownX = -1;
            this.mouseDownY = -1;
        }

        e.preventDefault();
        e.stopPropagation();

        if(!this.isDefaultInputHandlerEnabled)
            return;

        this.buttonStates[0] = false;
    };

    /**
        The touchMove event handling routine. This is for compatibility for touch devices.
        @private
    */
    touchMoveHandler(e) {
        if(!this.isLoaded)
            return;

        if(e.touches.length > 0) {
            var clientX = e.touches[0].clientX;
            var clientY = e.touches[0].clientY;

            if(this.onmousemove) {
                var info = this.pick(clientX, clientY);
                this.onmousemove(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            }

            e.preventDefault();
            e.stopPropagation();

            if(!this.isDefaultInputHandlerEnabled)
                return;

            if(this.mouseUsage == 'zoom') {
                this.zoomFactor *= (this.mouseY <= clientY) ? 1.04 : 0.96;
            }
            else if(this.mouseUsage == 'pan') {
                var ratio = (this.definition == 'low') ? 0.5 : ((this.definition == 'high') ? 2 : 1);
                this.panning[0] += ratio * (clientX - this.mouseX);
                this.panning[1] += ratio * (clientY - this.mouseY);
            }
            else if(this.mouseUsage == 'default' || this.mouseUsage == 'rotate') {
                var rotX = (clientY - this.mouseY) * 360 / this.canvas.width;
                var rotY = (clientX - this.mouseX) * 360 / this.canvas.height;
                this.rotMatrix.rotateAboutXAxis(rotX);
                this.rotMatrix.rotateAboutYAxis(rotY);
            }
            this.mouseX = clientX;
            this.mouseY = clientY;
            this.mouseDownX = -1;
            this.mouseDownY = -1;

            this.update();
        }
    };

    /**
        The keyDown event handling routine.
        @private
    */
    keyDownHandler(e) {
        if(!this.isDefaultInputHandlerEnabled)
            return;

        this.keyStates[e.keyCode] = true;
    };

    /**
        The keyUp event handling routine.
        @private
    */
    keyUpHandler(e) {
        if(!this.isDefaultInputHandlerEnabled)
            return;

        this.keyStates[e.keyCode] = false;
    };

    /**
        The gesture event handling routine which implements gesture-based control on touch devices.
        This is based on Hammer.js gesture event implementation.
        @private
    */
    gestureHandler(e) {
        if(!this.isLoaded)
            return;

        var clientX = e.gesture.center.pageX - document.body.scrollLeft;
        var clientY = e.gesture.center.pageY - document.body.scrollTop;
        var info = this.pick(clientX, clientY);

        switch(e.type) {
        case 'touch':
            if(this.onmousedown)
                this.onmousedown(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            this.baseZoomFactor = this.zoomFactor;
            this.mouseX = clientX;
            this.mouseY = clientY;
            this.mouseDownX = clientX;
            this.mouseDownY = clientY;
            break;
        case 'release':
            if(this.onmouseup)
                this.onmouseup(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            if(this.onmouseclick && this.mouseDownX == clientX && this.mouseDownY == clientY)
                this.onmouseclick(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            this.mouseDownX = -1;
            this.mouseDownY = -1;
            this.isTouchHeld = false;
            break;
        case 'hold':
            this.isTouchHeld = true;
            this.mouseDownX = -1;
            this.mouseDownY = -1;
            break;
        case 'drag':
            if(this.onmousemove)
                this.onmousemove(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            if(!this.isDefaultInputHandlerEnabled)
                break;
            if(this.isTouchHeld) {						// pan
                var ratio = (this.definition == 'low') ? 0.5 : ((this.definition == 'high') ? 2 : 1);
                this.panning[0] += ratio * (clientX - this.mouseX);
                this.panning[1] += ratio * (clientY - this.mouseY);
            }
            else if(!this.suppressDraggingRotation) {	// rotate
                var rotX = (clientY - this.mouseY) * 360 / this.canvas.width;
                var rotY = (clientX - this.mouseX) * 360 / this.canvas.height;
                this.rotMatrix.rotateAboutXAxis(rotX);
                this.rotMatrix.rotateAboutYAxis(rotY);
            }
            this.mouseX = clientX;
            this.mouseY = clientY;
            this.mouseDownX = -1;
            this.mouseDownY = -1;
            this.update();
            break;
        case 'pinch':									// zoom
            if(this.onmousewheel)
                this.onmousewheel(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            if(!this.isDefaultInputHandlerEnabled)
                break;
            this.suppressDraggingRotation = true;
            this.zoomFactor = this.baseZoomFactor * e.gesture.scale;
            this.mouseDownX = -1;
            this.mouseDownY = -1;
            this.update();
            break;
        case 'transformend':
            /*
            * Reset the flag to enable dragging rotation again after a delay of 0.25s after the end of a zooming.
            * This fixed unnecessary rotation at the end of a zooming when one finger has leaved the touch device
            * while the other still stays on it sliding.
            * By Jeremy Ellis <jeremy.ellis@mpsd.ca>
            */
            var self = this;
            setTimeout(function() {
                self.suppressDraggingRotation = false;
            }, 250);
            break;
        default:
            break;
        }

        e.gesture.preventDefault();
        e.gesture.stopPropagation();
    };

    /**
        Internally load a scene.
        @private
    */
    loadScene() {
        // terminate current loading if it is not finished yet
        if(this.abortUnfinishedLoadingFn)
            this.abortUnfinishedLoadingFn();

        this.scene = null;
        this.isLoaded = false;

        this.update();

        if(this.sceneUrl == '') {
            return false;
        }


        /*
        * Discard the query part of the URL string, if any, to get the correct file name.
        * By negatif@gmail.com
        */
        var questionMarkAt = this.sceneUrl.indexOf('?');
        var sceneUrlNoQuery = questionMarkAt == -1 ? this.sceneUrl : this.sceneUrl.substring(0, questionMarkAt);

        var lastSlashAt = sceneUrlNoQuery.lastIndexOf('/');
        if(lastSlashAt == -1)
            lastSlashAt = sceneUrlNoQuery.lastIndexOf('\\');

        var fileName = sceneUrlNoQuery.substring(lastSlashAt + 1);
        var lastDotAt = fileName.lastIndexOf('.');
        if(lastDotAt == -1) {
            return false;
        }

        var fileExtName = fileName.substring(lastDotAt + 1);

        if(!this.loader) {
            return false;
        }

        var self = this;

        this.loader.onload = function(scene) {
            self.abortUnfinishedLoadingFn = null;
            self.setupScene(scene);
            if(self.onloadingcomplete && (typeof self.onloadingcomplete) == 'function')
                self.onloadingcomplete();
        };


        // TODO: These can probably be extracted out from here into loader.
        //var errorMsg;
        this.loader.onerror = function(errorMsg) {
            self.scene = null;
            self.isLoaded = false;
            self.isFailed = true;
            self.abortUnfinishedLoadingFn = null;
            self.update();
            self.reportError(errorMsg);
            if(self.onloadingerror && (typeof self.onloadingerror) == 'function')
                self.onloadingerror(errorMsg);
        };

        this.loader.onprogress = function(task, prog) {
            if(self.showProgressBar)
                self.reportProgress(task, prog);
            if(self.onloadingprogress && (typeof self.onloadingprogress) == 'function')
                self.onloadingprogress(task, prog);
        };

        this.loader.onresource = function(resource) {
            if((resource instanceof Texture) && self.isMipMappingOn && !resource.hasMipmap())
                resource.generateMipmaps();
            self.update();
        };

        this.abortUnfinishedLoadingFn = function() {
            this.loader.abort();
            self.abortUnfinishedLoadingFn = null;
            self.hideProgress();
            if(self.onloadingaborted && (typeof self.onloadingaborted) == 'function')
                self.onloadingaborted();
        };

        this.loader.loadFromUrl(this.sceneUrl);

        if(this.onloadingstarted && (typeof this.onloadingstarted) == 'function')
            this.onloadingstarted();

        return true;
    };

    /**
        Prepare for rendering of a new scene.
        @private
    */
    setupScene(scene) {
        // crease-angle should be applied onto each mesh before their initialization
        if(this.creaseAngle >= 0) {
            var cAngle = this.creaseAngle;
            scene.forEachChild(function(mesh) {
                mesh.creaseAngle = cAngle;
            });
        }

        scene.init();

        if(!scene.isEmpty()) {
            var d = scene.aabb.lengthOfDiagonal();
            var w = this.frameWidth;
            var h = this.frameHeight;
            this.zoomFactor = (d == 0) ? 1 : (w < h ? w : h) / d;
            this.panning = [0, 0];
        }

        this.rotMatrix.identity();
        this.rotMatrix.rotateAboutXAxis(this.initRotX);
        this.rotMatrix.rotateAboutYAxis(this.initRotY);
        this.rotMatrix.rotateAboutZAxis(this.initRotZ);
        this.scene = scene;
        this.isLoaded = true;
        this.isFailed = false;
        this.needUpdate = false;
        this.needRepaint = false;
        this.update();
        this.hideProgress();
        this.hideError();
    };

    /**
        Show progress with information on current time-cosuming task.
        @param {String} task text information about current task.
        @param {Number} progress progress of current task. this should be a number between 0 and 1.
    */
    reportProgress(task, progress) {
        if(!this.progressFrame) {
            var canvasRect = this.canvas.getBoundingClientRect();

            var r = 255 - ((this.bkgColor1 & 0xff0000) >> 16);
            var g = 255 - ((this.bkgColor1 & 0xff00) >> 8);
            var b = 255 - (this.bkgColor1 & 0xff);
            var color = 'rgb(' + r + ',' + g + ',' + b + ')';

            var barX = window.pageXOffset + canvasRect.left + 40;
            var barY = window.pageYOffset + canvasRect.top  + canvasRect.height * 0.38;
            var barWidth = canvasRect.width - (barX - canvasRect.left) * 2;
            var barHeight = 20;

            this.progressFrame = document.createElement('div');
            this.progressFrame.style.position = 'absolute';
            this.progressFrame.style.left   = barX + 'px';
            this.progressFrame.style.top    = barY + 'px';
            this.progressFrame.style.width  = barWidth + 'px';
            this.progressFrame.style.height = barHeight + 'px';
            this.progressFrame.style.border = '1px solid ' + color;
            this.progressFrame.style.pointerEvents = 'none';
            document.body.appendChild(this.progressFrame);

            this.progressRectangle = document.createElement('div');
            this.progressRectangle.style.position = 'absolute';
            this.progressRectangle.style.left   = (barX + 3) + 'px';
            this.progressRectangle.style.top    = (barY + 3) + 'px';
            this.progressRectangle.style.width  = '0px';
            this.progressRectangle.style.height = (barHeight - 4) + 'px';
            this.progressRectangle.style.background = color;
            this.progressRectangle.style.pointerEvents = 'none';
            document.body.appendChild(this.progressRectangle);

            if(!this.messagePanel) {
                this.messagePanel = document.createElement('div');
                this.messagePanel.style.position = 'absolute';
                this.messagePanel.style.left   = barX + 'px';
                this.messagePanel.style.top    = (barY - 16) + 'px';
                this.messagePanel.style.width  = barWidth + 'px';
                this.messagePanel.style.height = '14px';
                this.messagePanel.style.font   = 'bold 14px Courier New';
                this.messagePanel.style.color  = color;
                this.messagePanel.style.pointerEvents = 'none';
                document.body.appendChild(this.messagePanel);
            }
        }

        if(this.progressFrame.style.display != 'block') {
            this.progressFrame.style.display = 'block';
            this.progressRectangle.style.display = 'block';
        }
        if(task && this.messagePanel.style.display != 'block')
            this.messagePanel.style.display = 'block';

        this.progressRectangle.style.width = (parseFloat(this.progressFrame.style.width) - 4) * progress + 'px';
        this.messagePanel.innerHTML = task;
    };

    /**
        Hide the progress bar.
        @private
    */
    hideProgress() {
        if(this.progressFrame) {
            this.messagePanel.style.display = 'none';
            this.progressFrame.style.display = 'none';
            this.progressRectangle.style.display = 'none';
        }
    };

    /**
        Show information about a fatal error.
        @param {String} message text information about this error.
    */
    reportError(message) {
        if(!this.messagePanel) {
            var canvasRect = this.canvas.getBoundingClientRect();

            var r = 255 - ((this.bkgColor1 & 0xff0000) >> 16);
            var g = 255 - ((this.bkgColor1 & 0xff00) >> 8);
            var b = 255 - (this.bkgColor1 & 0xff);
            var color = 'rgb(' + r + ',' + g + ',' + b + ')';

            var panelX = window.pageXOffset + canvasRect.left + 40;
            var panelY = window.pageYOffset + canvasRect.top  + canvasRect.height * 0.38;
            var panelWidth = canvasRect.width - (panelX - canvasRect.left) * 2;
            var panelHeight = 14;

            this.messagePanel = document.createElement('div');
            this.messagePanel.style.position = 'absolute';
            this.messagePanel.style.left   = panelX + 'px';
            this.messagePanel.style.top    = (panelY - 16) + 'px';
            this.messagePanel.style.width  = panelWidth + 'px';
            this.messagePanel.style.height = panelHeight + 'px';
            this.messagePanel.style.font   = 'bold 14px Courier New';
            this.messagePanel.style.color  = color;
            this.messagePanel.style.pointerEvents = 'none';
            document.body.appendChild(this.messagePanel);
        }

        // hide the progress bar if it is visible
        if(this.progressFrame.style.display != 'none') {
            this.progressFrame.style.display = 'none';
            this.progressRectangle.style.display = 'none';
        }

        if(message && this.messagePanel.style.display != 'block')
            this.messagePanel.style.display = 'block';

        this.messagePanel.innerHTML = message;
    };

    /**
        Hide the error message.
        @private
    */
    hideError() {
        if(this.messagePanel)
            this.messagePanel.style.display = 'none';
    };

    /**
        Fill the background color buffer.
        @private
    */
    generateBackground() {
        if(this.bkgImage)
            this.webglBackend.setBackgroundImage(this.bkgImage);
        else
            this.webglBackend.setBackgroundColors(this.bkgColor1, this.bkgColor2);
    };

    /**
        Do fill the background color buffer with gradient colors.
        @private
    */
    fillGradientBackground() {
        var w = this.frameWidth;
        var h = this.frameHeight;
        var pixels = this.bkgColorBuffer;

        var r1 = (this.bkgColor1 & 0xff0000) >> 16;
        var g1 = (this.bkgColor1 & 0xff00) >> 8;
        var b1 = this.bkgColor1 & 0xff;
        var r2 = (this.bkgColor2 & 0xff0000) >> 16;
        var g2 = (this.bkgColor2 & 0xff00) >> 8;
        var b2 = this.bkgColor2 & 0xff;

        var alpha = this.isBackgroundOn ? 0xff000000 : 0;

        var pix = 0;
        for(var i=0; i<h; i++) {
            var r = (r1 + i * (r2 - r1) / h) & 0xff;
            var g = (g1 + i * (g2 - g1) / h) & 0xff;
            var b = (b1 + i * (b2 - b1) / h) & 0xff;

            for(var j=0; j<w; j++) {
                pixels[pix++] = alpha | r << 16 | g << 8 | b;
            }
        }
    };

    /**
        Do fill the background color buffer with a loaded image.
        @private
        TODO: This function have some reference to old JSC3D Texture class. FIX!!!!
    */
    fillBackgroundWithImage() {
        //TODO: REMOVE This function probably.
    };

    /**
        Draw background onto canvas.
        @private
    */
    drawBackground() {
        this.beginScene();
        this.endScene();

        this.paint();
    };

    /**
        Begin to render a new frame.
        @private
    */
    beginScene() {
        this.webglBackend.beginFrame(this.definition, this.isBackgroundOn);
        return;
    };

    /**
        End for rendering of a frame.
        @private
    */
    endScene() {
        this.webglBackend.endFrame();
    };

    /**
        Render a new frame.
        @private
    */
    render() {
        if(this.scene.isEmpty())
            return;

        var aabb = this.scene.aabb;

        // calculate transformation matrix
        var w = this.frameWidth;
        var h = this.frameHeight;
        var d = aabb.lengthOfDiagonal();

        this.transformMatrix.identity();
        this.transformMatrix.translate(-0.5*(aabb.minX+aabb.maxX), -0.5*(aabb.minY+aabb.maxY), -0.5*(aabb.minZ+aabb.maxZ));
        this.transformMatrix.multiply(this.rotMatrix);
        this.transformMatrix.scale(2*this.zoomFactor/w, 2*this.zoomFactor/h, -2/d);
        this.transformMatrix.translate(2*this.panning[0]/w, -2*this.panning[1]/h, 0);

        // sort meshes into a render list
        var renderList = this.sortScene(this.transformMatrix);

        // delegate to WebGL backend to do the rendering
        this.webglBackend.render(this.scene.getChildren(), this.transformMatrix, this.rotMatrix, this.renderMode, this.defaultMaterial, this.sphereMap, this.isCullingDisabled);
    };

    /**
        Sort meshes inside the scene into a render list. The sorting criterion is a mixture of trnasparency and depth.
        This routine is necessary to ensure a correct rendering order. It also helps to reduce fill rate.
        @private
    */
    sortScene(mat) {
        var renderList = [];

        var meshes = this.scene.getChildren();
        for(var i=0; i<meshes.length; i++) {
            var mesh = meshes[i];
            if(!mesh.isTrivial()) {
                renderList.push(mesh);
                var meshCenter = mesh.aabb.center();
                new Math3D().transformVectors(mat, meshCenter, meshCenter);
                var meshMaterial = mesh.material ? mesh.material : this.defaultMaterial;
                mesh.sortKey = {
                    depth: meshCenter[2],
                    isTransparnt: (meshMaterial.transparency > 0) || (mesh.hasTexture() ? mesh.texture.hasTransparency : false)
                };
            }
        }

        renderList.sort(
            function(mesh0, mesh1) {
                // opaque meshes should always be prior to transparent ones to be rendered
                if(!mesh0.sortKey.isTransparnt && mesh1.sortKey.isTransparnt)
                    return -1;

                // opaque meshes should always be prior to transparent ones to be rendered
                if(mesh0.sortKey.isTransparnt && !mesh1.sortKey.isTransparnt)
                    return 1;

                // transparent meshes should be rendered from far to near
                if(mesh0.sortKey.isTransparnt)
                    return mesh0.sortKey.depth - mesh1.sortKey.depth;

                // opaque meshes should be rendered form near to far
                return mesh1.sortKey.depth - mesh0.sortKey.depth;
        } );

        return renderList;
    };

    /**
        Render the given mesh as points.
        @private
    */
    renderPoint(mesh) {
        var w = this.frameWidth;
        var h = this.frameHeight;
        var xbound = w - 1;
        var ybound = h - 1;
        var ibuf = mesh.indexBuffer;
        var vbuf = mesh.transformedVertexBuffer;
        var cbuf = this.colorBuffer;
        var zbuf = this.zBuffer;
        var sbuf = this.selectionBuffer;
        var numOfVertices = vbuf.length / 3;
        var id = mesh.internalId;
        var color = 0xff000000 | (mesh.material ? mesh.material.diffuseColor : this.defaultMaterial.diffuseColor);

        for(var i=0, j=0; i<numOfVertices; i++, j+=3) {
            var x = ~~(vbuf[j    ] + 0.5);
            var y = ~~(vbuf[j + 1] + 0.5);
            var z = vbuf[j + 2];
            if(x >=0 && x < xbound && y >=0 && y < ybound) {
                var pix = y * w + x;
                if(z > zbuf[pix]) {
                    zbuf[pix] = z;
                    cbuf[pix] = color;
                    sbuf[pix] = id;
                }
                pix++;
                if(z > zbuf[pix]) {
                    zbuf[pix] = z;
                    cbuf[pix] = color;
                    sbuf[pix] = id;
                }
                pix += xbound;
                if(z > zbuf[pix]) {
                    zbuf[pix] = z;
                    cbuf[pix] = color;
                    sbuf[pix] = id;
                }
                pix++;
                if(z > zbuf[pix]) {
                    zbuf[pix] = z;
                    cbuf[pix] = color;
                    sbuf[pix] = id;
                }
            }   
        }
    };

    /**
        Render the given mesh as wireframe.
        @private
    */
    renderWireframe(mesh) {
        var w = this.frameWidth;
        var h = this.frameHeight;
        var xbound = w - 1;
        var ybound = h - 1;
        var ibuf = mesh.indexBuffer;
        var vbuf = mesh.transformedVertexBuffer;
        var nbuf = mesh.transformedFaceNormalZBuffer;
        var cbuf = this.colorBuffer;
        var zbuf = this.zBuffer;
        var sbuf = this.selectionBuffer;
        var numOfFaces = mesh.faceCount;
        var id = mesh.internalId;
        var color = 0xff000000 | (mesh.material ? mesh.material.diffuseColor : this.defaultMaterial.diffuseColor);
        var drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        if(!nbuf || nbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            nbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, nbuf);

        var i = 0, j = 0;
        while(i < numOfFaces) {
            var xformedNz = nbuf[i++];
            if(drawBothSides)
                xformedNz = xformedNz > 0 ? xformedNz : -xformedNz;
            if(xformedNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            }
            else {
                var vStart, v0, v1;
                v0 = ibuf[j++] * 3;
                v1 = ibuf[j++] * 3;
                vStart = v0;

                var isClosed = false;
                while(!isClosed) {
                    var x0 = ~~(vbuf[v0    ] + 0.5);
                    var y0 = ~~(vbuf[v0 + 1] + 0.5);
                    var z0 = vbuf[v0 + 2];
                    var x1 = ~~(vbuf[v1    ] + 0.5);
                    var y1 = ~~(vbuf[v1 + 1] + 0.5);
                    var z1 = vbuf[v1 + 2];

                    var dx = x1 - x0;
                    var dy = y1 - y0;
                    var dz = z1 - z0;

                    var dd;
                    var xInc, yInc, zInc;
                    if(Math.abs(dx) > Math.abs(dy)) {
                        dd = dx;
                        xInc = dx > 0 ? 1 : -1;
                        yInc = dx != 0 ? xInc * dy / dx : 0;
                        zInc = dx != 0 ? xInc * dz / dx : 0;
                    }
                    else {
                        dd = dy;
                        yInc = dy > 0 ? 1 : -1;
                        xInc = dy != 0 ? yInc * dx / dy : 0;
                        zInc = dy != 0 ? yInc * dz / dy : 0;
                    }

                    var x = x0;
                    var y = y0;
                    var z = z0;

                    if(dd < 0) {
                        x = x1;
                        y = y1;
                        z = z1;
                        dd = -dd;
                        xInc = -xInc;
                        yInc = -yInc;
                        zInc = -zInc;
                    }

                    for(var k=0; k<dd; k++) {
                        if(x >=0 && x < xbound && y >=0 && y < ybound) {
                            var pix = (~~y) * w + (~~x);
                            if(z > zbuf[pix]) {
                                zbuf[pix] = z;
                                cbuf[pix] = color;
                                sbuf[pix] = id;
                            }
                        }

                        x += xInc;
                        y += yInc;
                        z += zInc;
                    }

                    if(v1 == vStart) {
                        isClosed = true;
                    }
                    else {
                        v0 = v1;

                        if(ibuf[j] != -1) {
                            v1 = ibuf[j++] * 3;
                        }
                        else {
                            v1 = vStart;
                        }
                    }
                }

                j++;
            }
        }
    };

    /**
        Render the given mesh as solid object, using flat shading.
        @private
    */
    renderSolidFlat(mesh) {
        var w = this.frameWidth;
        var h = this.frameHeight;
        var ibuf = mesh.indexBuffer;
        var vbuf = mesh.transformedVertexBuffer;
        var nbuf = mesh.transformedFaceNormalZBuffer;
        var cbuf = this.colorBuffer;
        var zbuf = this.zBuffer;
        var sbuf = this.selectionBuffer;
        var numOfFaces = mesh.faceCount;
        var id = mesh.internalId;
        var material = mesh.material ? mesh.material : this.defaultMaterial;
        var palette = material.getPalette();
        var isOpaque = material.transparency == 0;
        var trans = ~~(material.transparency * 255);
        var opaci = 255 - trans;
        var drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if(material.transparency == 1)
            return;

        if(!nbuf || nbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            nbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, nbuf);

        var Xs = new Array(3);
        var Ys = new Array(3);
        var Zs = new Array(3);
        var i = 0, j = 0;
        while(i < numOfFaces) {
            var xformedNz = nbuf[i++];
            if(drawBothSides)
                xformedNz = xformedNz > 0 ? xformedNz : -xformedNz;
            if(xformedNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            }
            else {
                var color = 0xff000000 | palette[~~(xformedNz * 255)];

                var v0, v1, v2;
                v0 = ibuf[j++] * 3;
                v1 = ibuf[j++] * 3;

                do {
                    v2 = ibuf[j++] * 3;

                    Xs[0] = ~~(vbuf[v0    ] + 0.5);
                    Ys[0] = ~~(vbuf[v0 + 1] + 0.5);
                    Zs[0] = vbuf[v0 + 2];
                    Xs[1] = ~~(vbuf[v1    ] + 0.5);
                    Ys[1] = ~~(vbuf[v1 + 1] + 0.5);
                    Zs[1] = vbuf[v1 + 2];
                    Xs[2] = ~~(vbuf[v2    ] + 0.5);
                    Ys[2] = ~~(vbuf[v2 + 1] + 0.5);
                    Zs[2] = vbuf[v2 + 2];

                    var high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    var low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    var mid = 3 - low - high;

                    if(high != low) {
                        var x0 = Xs[low];
                        var z0 = Zs[low];
                        var dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        var xStep0 = (Xs[low] - Xs[high]) / dy0;
                        var zStep0 = (Zs[low] - Zs[high]) / dy0;

                        var x1 = Xs[low];
                        var z1 = Zs[low];
                        var dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        var xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        var zStep1 = (Zs[low] - Zs[mid]) / dy1;

                        var x2 = Xs[mid];
                        var z2 = Zs[mid];
                        var dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        var xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        var zStep2 = (Zs[mid] - Zs[high]) / dy2;

                        var linebase = Ys[low] * w;
                        for(var y=Ys[low]; y>Ys[high]; y--) {
                            if(y >=0 && y < h) {
                                var xLeft = ~~x0;
                                var zLeft = z0;
                                var xRight, zRight;
                                if(y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                }
                                else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                }

                                if(xLeft > xRight) {
                                    var temp;
                                    temp = xLeft;
                                    xLeft = xRight;
                                    xRight = temp;
                                    temp = zLeft;
                                    zLeft = zRight;
                                    zRight = temp;
                                }

                                if(xLeft < 0)
                                    xLeft = 0;
                                if(xRight >= w)
                                    xRight = w - 1;

                                var zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                var pix = linebase + xLeft;
                                if(isOpaque) {
                                    for(var x=xLeft, z=zLeft; x<=xRight; x++, z+=zInc) {
                                        if(z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            cbuf[pix] = color;
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                                else {
                                    for(var x=xLeft, z=zLeft; x<xRight; x++, z+=zInc) {
                                        if(z > zbuf[pix]) {
                                            var foreColor = color;
                                            var backColor = cbuf[pix];
                                            var rr = ((backColor & 0xff0000) * trans + (foreColor & 0xff0000) * opaci) >> 8;
                                            var gg = ((backColor & 0xff00) * trans + (foreColor & 0xff00) * opaci) >> 8;
                                            var bb = ((backColor & 0xff) * trans + (foreColor & 0xff) * opaci) >> 8;
                                            var aa = (backColor & 0xff000000) | (opaci << 24);
                                            cbuf[pix] = aa | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                            }

                            // step up to next scanline
                            //
                            x0 -= xStep0;
                            z0 -= zStep0;
                            if(y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                            }
                            else {
                                x2 -= xStep2;
                                z2 -= zStep2;
                            }
                            linebase -= w;
                        }
                    }

                    v1 = v2;
                } while (ibuf[j] != -1);

                j++;
            }
        }
    };

    /**
        Render the given mesh as solid object, using smooth shading.
        @private
    */
    renderSolidSmooth(mesh) {
        var w = this.frameWidth;
        var h = this.frameHeight;
        var ibuf = mesh.indexBuffer;
        var vbuf = mesh.transformedVertexBuffer;
        var vnbuf = mesh.transformedVertexNormalZBuffer;
        var vnibuf = mesh.vertexNormalIndexBuffer ? mesh.vertexNormalIndexBuffer : mesh.indexBuffer;
        var fnbuf = mesh.transformedFaceNormalZBuffer;
        var cbuf = this.colorBuffer;
        var zbuf = this.zBuffer;
        var sbuf = this.selectionBuffer;
        var numOfFaces = mesh.faceCount;
        var numOfVertices = vbuf.length / 3;
        var id = mesh.internalId;
        var material = mesh.material ? mesh.material : this.defaultMaterial;
        var palette = material.getPalette();
        var isOpaque = material.transparency == 0;
        var trans = ~~(material.transparency * 255);
        var opaci = 255 - trans;
        var drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if(material.transparency == 1)
            return;

        if(!vnbuf || vnbuf.length < mesh.vertexNormalBuffer.length/3) {
            mesh.transformedVertexNormalZBuffer = new Array(mesh.vertexNormalBuffer.length / 3);
            vnbuf = mesh.transformedVertexNormalZBuffer;
        }

        if(!fnbuf || fnbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            fnbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.vertexNormalBuffer, vnbuf);
        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, fnbuf);

        var Xs = new Array(3);
        var Ys = new Array(3);
        var Zs = new Array(3);
        var Ns = new Array(3);
        var i = 0, j = 0;
        while(i < numOfFaces) {
            var xformedFNz = fnbuf[i++];
            if(drawBothSides)
                xformedFNz = xformedFNz > 0 ? xformedFNz : -xformedFNz;
            if(xformedFNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            }
            else {
                var i0, i1, i2;
                var v0, v1, v2;
                var ni0, ni1, ni2;
                i0 = ibuf[j];
                v0 = i0 * 3;
                ni0 = vnibuf[j];
                j++;
                i1 = ibuf[j];
                v1 = i1 * 3;
                ni1 = vnibuf[j];
                j++;

                do {
                    i2 = ibuf[j];
                    v2 = i2 * 3;
                    ni2 = vnibuf[j];
                    j++;

                    Xs[0] = ~~(vbuf[v0    ] + 0.5);
                    Ys[0] = ~~(vbuf[v0 + 1] + 0.5);
                    Zs[0] = vbuf[v0 + 2];
                    Xs[1] = ~~(vbuf[v1    ] + 0.5);
                    Ys[1] = ~~(vbuf[v1 + 1] + 0.5);
                    Zs[1] = vbuf[v1 + 2];
                    Xs[2] = ~~(vbuf[v2    ] + 0.5);
                    Ys[2] = ~~(vbuf[v2 + 1] + 0.5);
                    Zs[2] = vbuf[v2 + 2];

                    Ns[0] = vnbuf[ni0];
                    Ns[1] = vnbuf[ni1];
                    Ns[2] = vnbuf[ni2];
                    if(drawBothSides) {
                        if(Ns[0] < 0)
                            Ns[0] = -Ns[0];
                        if(Ns[1] < 0)
                            Ns[1] = -Ns[1];
                        if(Ns[2] < 0)
                            Ns[2] = -Ns[2];
                    }

                    var high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    var low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    var mid = 3 - low - high;

                    if(high != low) {
                        var x0 = Xs[low];
                        var z0 = Zs[low];
                        var n0 = Ns[low] * 255;
                        var dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        var xStep0 = (Xs[low] - Xs[high]) / dy0;
                        var zStep0 = (Zs[low] - Zs[high]) / dy0;
                        var nStep0 = (Ns[low] - Ns[high]) * 255 / dy0;

                        var x1 = Xs[low];
                        var z1 = Zs[low];
                        var n1 = Ns[low] * 255;
                        var dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        var xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        var zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        var nStep1 = (Ns[low] - Ns[mid]) * 255 / dy1;

                        var x2 = Xs[mid];
                        var z2 = Zs[mid];
                        var n2 = Ns[mid] * 255;
                        var dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        var xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        var zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        var nStep2 = (Ns[mid] - Ns[high]) * 255 / dy2;

                        var linebase = Ys[low] * w;
                        for(var y=Ys[low]; y>Ys[high]; y--) {
                            if(y >=0 && y < h) {
                                var xLeft = ~~x0;
                                var zLeft = z0;
                                var nLeft = n0;
                                var xRight, zRight, nRight;
                                if(y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    nRight = n1;
                                }
                                else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    nRight = n2;
                                }

                                if(xLeft > xRight) {
                                    var temp;
                                    temp = xLeft;
                                    xLeft = xRight;
                                    xRight = temp;
                                    temp = zLeft;
                                    zLeft = zRight;
                                    zRight = temp;
                                    temp = nLeft;
                                    nLeft = nRight;
                                    nRight = temp;
                                }

                                var zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                var nInc = (xLeft != xRight) ? ((nRight - nLeft) / (xRight - xLeft)) : 1;
                                if(xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    nLeft -= xLeft * nInc;
                                    xLeft = 0;
                                }
                                if(xRight >= w) {
                                    xRight = w - 1;
                                }
                                var pix = linebase + xLeft;
                                if(isOpaque) {
                                    for(var x=xLeft, z=zLeft, n=nLeft; x<=xRight; x++, z+=zInc, n+=nInc) {
                                        if(z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            cbuf[pix] = 0xff000000 | palette[n > 0 ? (~~n) : 0];
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                                else {
                                    for(var x=xLeft, z=zLeft, n=nLeft; x<xRight; x++, z+=zInc, n+=nInc) {
                                        if(z > zbuf[pix]) {
                                            var foreColor = palette[n > 0 ? (~~n) : 0];
                                            var backColor = cbuf[pix];
                                            var rr = ((backColor & 0xff0000) * trans + (foreColor & 0xff0000) * opaci) >> 8;
                                            var gg = ((backColor & 0xff00) * trans + (foreColor & 0xff00) * opaci) >> 8;
                                            var bb = ((backColor & 0xff) * trans + (foreColor & 0xff) * opaci) >> 8;
                                            var aa = (backColor & 0xff000000) | (opaci << 24);
                                            cbuf[pix] = aa | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                            }

                            // step up to next scanline
                            //
                            x0 -= xStep0;
                            z0 -= zStep0;
                            n0 -= nStep0;
                            if(y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                n1 -= nStep1;
                            }
                            else {
                                x2 -= xStep2;
                                z2 -= zStep2;
                                n2 -= nStep2;
                            }
                            linebase -= w;
                        }
                    }

                    v1 = v2;
                    i1 = i2;
                    ni1 = ni2;
                } while (ibuf[j] != -1);

                j++;
            }
        }
    };

    /**
        Render the given mesh as textured object, with no lightings.
        @private
    */
    renderSolidTexture(mesh) {
        var w = this.frameWidth;
        var h = this.frameHeight;
        var ibuf = mesh.indexBuffer;
        var vbuf = mesh.transformedVertexBuffer;
        var nbuf = mesh.transformedFaceNormalZBuffer;
        var cbuf = this.colorBuffer;
        var zbuf = this.zBuffer;
        var sbuf = this.selectionBuffer;
        var numOfFaces = mesh.faceCount;
        var id = mesh.internalId;
        var texture = mesh.texture;
        var isOpaque = !texture.hasTransparency;
        var tbuf = mesh.texCoordBuffer;
        var tibuf = mesh.texCoordIndexBuffer ? mesh.texCoordIndexBuffer : mesh.indexBuffer;
        var tdata = texture.data;
        var tdim = texture.width;
        var tbound = tdim - 1;
        var mipmaps = texture.hasMipmap() ? texture.mipmaps : null;
        var mipentries = mipmaps ? texture.mipentries : null;
        var drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        if(!nbuf || nbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            nbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, nbuf);

        var Xs = new Array(3);
        var Ys = new Array(3);
        var Zs = new Array(3);
        var THs = new Array(3);
        var TVs = new Array(3);
        var i = 0, j = 0;
        while(i < numOfFaces) {
            var xformedNz = nbuf[i++];
            if(drawBothSides)
                xformedNz = xformedNz > 0 ? xformedNz : -xformedNz;
            if(xformedNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            }
            else {
                var v0, v1, v2;
                var t0, t1, t2;
                v0 = ibuf[j] * 3;
                t0 = tibuf[j] * 2;
                j++;
                v1 = ibuf[j] * 3;
                t1 = tibuf[j] * 2;
                j++;

                // select an appropriate mip-map level for texturing
                //
                if(mipmaps) {
                    v2 = ibuf[j] * 3;
                    t2 = tibuf[j] * 2;

                    tdim = texture.width;

                    Xs[0] = vbuf[v0    ];
                    Ys[0] = vbuf[v0 + 1];
                    Xs[1] = vbuf[v1    ];
                    Ys[1] = vbuf[v1 + 1];
                    Xs[2] = vbuf[v2    ];
                    Ys[2] = vbuf[v2 + 1];

                    THs[0] = tbuf[t0    ] * tdim;
                    TVs[0] = tbuf[t0 + 1] * tdim;
                    THs[1] = tbuf[t1    ] * tdim;
                    TVs[1] = tbuf[t1 + 1] * tdim;
                    THs[2] = tbuf[t2    ] * tdim;
                    TVs[2] = tbuf[t2 + 1] * tdim;

                    var faceArea = (Xs[1] - Xs[0]) * (Ys[2] - Ys[0]) - (Ys[1] - Ys[0]) * (Xs[2] - Xs[0]);
                    if(faceArea < 0)
                        faceArea = -faceArea;
                    faceArea += 1;
                    var texArea = (THs[1] - THs[0]) * (TVs[2] - TVs[0]) - (TVs[1] -  TVs[0]) * (THs[2] - THs[0]);
                    if(texArea < 0)
                        texArea = -texArea;
                    var mipRatio = texArea / faceArea;

                    var level = 0;
                    if(mipRatio < mipentries[1])
                        level = 0;
                    else if(mipRatio >= mipentries[mipentries.length - 1]) {
                        level = mipentries.length - 1;
                        tdim = 1;
                    }
                    else {
                        while(mipRatio >= mipentries[level+1]) {
                            level++;
                            tdim /= 2;
                        }
                    }

                    tdata = mipmaps[level];
                    tbound = tdim - 1;
                }

                do {
                    v2 = ibuf[j] * 3;
                    t2 = tibuf[j] * 2;
                    j++;

                    Xs[0] = ~~(vbuf[v0    ] + 0.5);
                    Ys[0] = ~~(vbuf[v0 + 1] + 0.5);
                    Zs[0] = vbuf[v0 + 2];
                    Xs[1] = ~~(vbuf[v1    ] + 0.5);
                    Ys[1] = ~~(vbuf[v1 + 1] + 0.5);
                    Zs[1] = vbuf[v1 + 2];
                    Xs[2] = ~~(vbuf[v2    ] + 0.5);
                    Ys[2] = ~~(vbuf[v2 + 1] + 0.5);
                    Zs[2] = vbuf[v2 + 2];

                    THs[0] = tbuf[t0    ] * tdim;
                    TVs[0] = tbuf[t0 + 1] * tdim;
                    THs[1] = tbuf[t1    ] * tdim;
                    TVs[1] = tbuf[t1 + 1] * tdim;
                    THs[2] = tbuf[t2    ] * tdim;
                    TVs[2] = tbuf[t2 + 1] * tdim;

                    var high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    var low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    var mid = 3 - low - high;

                    if(high != low) {
                        var x0 = Xs[low];
                        var z0 = Zs[low];
                        var th0 = THs[low];
                        var tv0 = TVs[low];
                        var dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        var xStep0 = (Xs[low] - Xs[high]) / dy0;
                        var zStep0 = (Zs[low] - Zs[high]) / dy0;
                        var thStep0 = (THs[low] - THs[high]) / dy0;
                        var tvStep0 = (TVs[low] - TVs[high]) / dy0;

                        var x1 = Xs[low];
                        var z1 = Zs[low];
                        var th1 = THs[low];
                        var tv1 = TVs[low];
                        var dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        var xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        var zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        var thStep1 = (THs[low] - THs[mid]) / dy1;
                        var tvStep1 = (TVs[low] - TVs[mid]) / dy1;

                        var x2 = Xs[mid];
                        var z2 = Zs[mid];
                        var th2 = THs[mid];
                        var tv2 = TVs[mid];
                        var dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        var xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        var zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        var thStep2 = (THs[mid] - THs[high]) / dy2;
                        var tvStep2 = (TVs[mid] - TVs[high]) / dy2;

                        var linebase = Ys[low] * w;
                        for(var y=Ys[low]; y>Ys[high]; y--) {
                            if(y >=0 && y < h) {
                                var xLeft = ~~x0;
                                var zLeft = z0;
                                var thLeft = th0;
                                var tvLeft = tv0;
                                var xRight, zRight, thRight, tvRight;
                                if(y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    thRight = th1;
                                    tvRight = tv1;
                                }
                                else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    thRight = th2;
                                    tvRight = tv2;
                                }

                                if(xLeft > xRight) {
                                    var temp;
                                    temp = xLeft;
                                    xLeft = xRight;
                                    xRight = temp;
                                    temp = zLeft;
                                    zLeft = zRight;
                                    zRight = temp;
                                    temp = thLeft;
                                    thLeft = thRight;
                                    thRight = temp;
                                    temp = tvLeft;
                                    tvLeft = tvRight;
                                    tvRight = temp;
                                }

                                var zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                var thInc = (xLeft != xRight) ? ((thRight - thLeft) / (xRight - xLeft)) : 1;
                                var tvInc = (xLeft != xRight) ? ((tvRight - tvLeft) / (xRight - xLeft)) : 1;

                                if(xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    thLeft -= xLeft * thInc;
                                    tvLeft -= xLeft * tvInc;
                                    xLeft = 0;
                                }
                                if(xRight >= w)
                                    xRight = w - 1;

                                var pix = linebase + xLeft;
                                if(isOpaque) {
                                    for(var x=xLeft, z=zLeft, th=thLeft, tv=tvLeft; x<=xRight; x++, z+=zInc, th+=thInc, tv+=tvInc) {
                                        if(z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            cbuf[pix] = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                                else {
                                    for(var x=xLeft, z=zLeft, th=thLeft, tv=tvLeft; x<xRight; x++, z+=zInc, th+=thInc, tv+=tvInc) {
                                        if(z > zbuf[pix]) {
                                            var foreColor = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            var backColor = cbuf[pix];
                                            var opaci = (foreColor >> 24) & 0xff;
                                            var trans = 255 - opaci;
                                            var rr = ((backColor & 0xff0000) * trans + (foreColor & 0xff0000) * opaci) >> 8;
                                            var gg = ((backColor & 0xff00) * trans + (foreColor & 0xff00) * opaci) >> 8;
                                            var bb = ((backColor & 0xff) * trans + (foreColor & 0xff) * opaci) >> 8;
                                            var aa = (backColor & 0xff000000) | (opaci << 24);
                                            cbuf[pix] = aa | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                            }

                            // step up to next scanline
                            //
                            x0 -= xStep0;
                            z0 -= zStep0;
                            th0 -= thStep0;
                            tv0 -= tvStep0;
                            if(y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                th1 -= thStep1;
                                tv1 -= tvStep1;
                            }
                            else {
                                x2 -= xStep2;
                                z2 -= zStep2;
                                th2 -= thStep2;
                                tv2 -= tvStep2;
                            }
                            linebase -= w;
                        }
                    }

                    v1 = v2;
                    t1 = t2;
                } while (ibuf[j] != -1);

                j++;
            }
        }
    };

    /**
        Render the given mesh as textured object. Lighting will be calculated per face.
        @private
    */
    renderTextureFlat(mesh) {
        var w = this.frameWidth;
        var h = this.frameHeight;
        var ibuf = mesh.indexBuffer;
        var vbuf = mesh.transformedVertexBuffer;
        var nbuf = mesh.transformedFaceNormalZBuffer;
        var cbuf = this.colorBuffer;
        var zbuf = this.zBuffer;
        var sbuf = this.selectionBuffer;
        var numOfFaces = mesh.faceCount;
        var id = mesh.internalId;
        var material = mesh.material ? mesh.material : this.defaultMaterial;
        var palette = material.getPalette();
        var texture = mesh.texture;
        var isOpaque = (material.transparency == 0) && !texture.hasTransparency;
        var matOpacity = ~~((1 - material.transparency) * 255);
        var tbuf = mesh.texCoordBuffer;
        var tibuf = mesh.texCoordIndexBuffer ? mesh.texCoordIndexBuffer : mesh.indexBuffer;
        var tdata = texture.data;
        var tdim = texture.width;
        var tbound = tdim - 1;
        var mipmaps = texture.hasMipmap() ? texture.mipmaps : null;
        var mipentries = mipmaps ? texture.mipentries : null;
        var drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if(material.transparency == 1)
            return;

        if(!nbuf || nbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            nbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, nbuf);

        var Xs = new Array(3);
        var Ys = new Array(3);
        var Zs = new Array(3);
        var THs = new Array(3);
        var TVs = new Array(3);
        var i = 0, j = 0;
        while(i < numOfFaces) {
            var xformedNz = nbuf[i++];
            if(drawBothSides)
                xformedNz = xformedNz > 0 ? xformedNz : -xformedNz;
            if(xformedNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            }
            else {
                var color = 0xff000000 | palette[~~(xformedNz * 255)];

                var v0, v1, v2;
                var t0, t1, t2;
                v0 = ibuf[j] * 3;
                t0 = tibuf[j] * 2;
                j++;
                v1 = ibuf[j] * 3;
                t1 = tibuf[j] * 2;
                j++;

                if(mipmaps) {
                    v2 = ibuf[j] * 3;
                    t2 = tibuf[j] * 2;

                    tdim = texture.width;

                    Xs[0] = vbuf[v0    ];
                    Ys[0] = vbuf[v0 + 1];
                    Xs[1] = vbuf[v1    ];
                    Ys[1] = vbuf[v1 + 1];
                    Xs[2] = vbuf[v2    ];
                    Ys[2] = vbuf[v2 + 1];

                    THs[0] = tbuf[t0    ] * tdim;
                    TVs[0] = tbuf[t0 + 1] * tdim;
                    THs[1] = tbuf[t1    ] * tdim;
                    TVs[1] = tbuf[t1 + 1] * tdim;
                    THs[2] = tbuf[t2    ] * tdim;
                    TVs[2] = tbuf[t2 + 1] * tdim;

                    var faceArea = (Xs[1] - Xs[0]) * (Ys[2] - Ys[0]) - (Ys[1] - Ys[0]) * (Xs[2] - Xs[0]);
                    if(faceArea < 0)
                        faceArea = -faceArea;
                    faceArea += 1;
                    var texArea = (THs[1] - THs[0]) * (TVs[2] - TVs[0]) - (TVs[1] -  TVs[0]) * (THs[2] - THs[0]);
                    if(texArea < 0)
                        texArea = -texArea;
                    var mipRatio = texArea / faceArea;

                    var level = 0;
                    if(mipRatio < mipentries[1])
                        level = 0;
                    else if(mipRatio >= mipentries[mipentries.length - 1]) {
                        level = mipentries.length - 1;
                        tdim = 1;
                    }
                    else {
                        while(mipRatio >= mipentries[level+1]) {
                            level++;
                            tdim /= 2;
                        }
                    }

                    tdata = mipmaps[level];
                    tbound = tdim - 1;
                }

                do {
                    v2 = ibuf[j] * 3;
                    t2 = tibuf[j] * 2;
                    j++;

                    Xs[0] = ~~(vbuf[v0    ] + 0.5);
                    Ys[0] = ~~(vbuf[v0 + 1] + 0.5);
                    Zs[0] = vbuf[v0 + 2];
                    Xs[1] = ~~(vbuf[v1    ] + 0.5);
                    Ys[1] = ~~(vbuf[v1 + 1] + 0.5);
                    Zs[1] = vbuf[v1 + 2];
                    Xs[2] = ~~(vbuf[v2    ] + 0.5);
                    Ys[2] = ~~(vbuf[v2 + 1] + 0.5);
                    Zs[2] = vbuf[v2 + 2];

                    THs[0] = tbuf[t0    ] * tdim;
                    TVs[0] = tbuf[t0 + 1] * tdim;
                    THs[1] = tbuf[t1    ] * tdim;
                    TVs[1] = tbuf[t1 + 1] * tdim;
                    THs[2] = tbuf[t2    ] * tdim;
                    TVs[2] = tbuf[t2 + 1] * tdim;

                    var high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    var low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    var mid = 3 - low - high;

                    if(high != low) {
                        var x0 = Xs[low];
                        var z0 = Zs[low];
                        var th0 = THs[low];
                        var tv0 = TVs[low];
                        var dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        var xStep0 = (Xs[low] - Xs[high]) / dy0;
                        var zStep0 = (Zs[low] - Zs[high]) / dy0;
                        var thStep0 = (THs[low] - THs[high]) / dy0;
                        var tvStep0 = (TVs[low] - TVs[high]) / dy0;

                        var x1 = Xs[low];
                        var z1 = Zs[low];
                        var th1 = THs[low];
                        var tv1 = TVs[low];
                        var dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        var xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        var zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        var thStep1 = (THs[low] - THs[mid]) / dy1;
                        var tvStep1 = (TVs[low] - TVs[mid]) / dy1;

                        var x2 = Xs[mid];
                        var z2 = Zs[mid];
                        var th2 = THs[mid];
                        var tv2 = TVs[mid];
                        var dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        var xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        var zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        var thStep2 = (THs[mid] - THs[high]) / dy2;
                        var tvStep2 = (TVs[mid] - TVs[high]) / dy2;

                        var linebase = Ys[low] * w;
                        for(var y=Ys[low]; y>Ys[high]; y--) {
                            if(y >=0 && y < h) {
                                var xLeft = ~~x0;
                                var zLeft = z0;
                                var thLeft = th0;
                                var tvLeft = tv0;
                                var xRight, zRight, thRight, tvRight;
                                if(y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    thRight = th1;
                                    tvRight = tv1;
                                }
                                else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    thRight = th2;
                                    tvRight = tv2;
                                }

                                if(xLeft > xRight) {
                                    var temp;
                                    temp = xLeft;
                                    xLeft = xRight;
                                    xRight = temp;
                                    temp = zLeft;
                                    zLeft = zRight;
                                    zRight = temp;
                                    temp = thLeft;
                                    thLeft = thRight;
                                    thRight = temp;
                                    temp = tvLeft;
                                    tvLeft = tvRight;
                                    tvRight = temp;
                                }

                                var zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                var thInc = (xLeft != xRight) ? ((thRight - thLeft) / (xRight - xLeft)) : 1;
                                var tvInc = (xLeft != xRight) ? ((tvRight - tvLeft) / (xRight - xLeft)) : 1;

                                if(xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    thLeft -= xLeft * thInc;
                                    tvLeft -= xLeft * tvInc;
                                    xLeft = 0;
                                }
                                if(xRight >= w)
                                    xRight = w - 1;

                                var pix = linebase + xLeft;
                                if(isOpaque) {
                                    for(var x=xLeft, z=zLeft, th=thLeft, tv=tvLeft; x<=xRight; x++, z+=zInc, th+=thInc, tv+=tvInc) {
                                        if(z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            var texel = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            var rr = (((color & 0xff0000) >> 16) * ((texel & 0xff0000) >> 8));
                                            var gg = (((color & 0xff00) >> 8) * ((texel & 0xff00) >> 8));
                                            var bb = ((color & 0xff) * (texel & 0xff)) >> 8;
                                            cbuf[pix] = 0xff000000 | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                                else {
                                    for(var x=xLeft, z=zLeft, th=thLeft, tv=tvLeft; x<xRight; x++, z+=zInc, th+=thInc, tv+=tvInc) {
                                        if(z > zbuf[pix]) {
                                            var foreColor = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            var backColor = cbuf[pix];
                                            var opaci = (((foreColor >> 24) & 0xff) * (matOpacity & 0xff)) >> 8;
                                            var rr = (((color & 0xff0000) >> 16) * ((foreColor & 0xff0000) >> 8));
                                            var gg = (((color & 0xff00) >> 8) * ((foreColor & 0xff00) >> 8));
                                            var bb = ((color & 0xff) * (foreColor & 0xff)) >> 8;
                                            var aa = (backColor & 0xff000000) | (opaci << 24);
                                            if(opaci > 250) {
                                                zbuf[pix] = z;
                                            }
                                            else {
                                                var trans = 255 - opaci;
                                                rr = (rr * opaci + (backColor & 0xff0000) * trans) >> 8;
                                                gg = (gg * opaci + (backColor & 0xff00) * trans) >> 8;
                                                bb = (bb * opaci + (backColor & 0xff) * trans) >> 8;
                                            }
                                            cbuf[pix] = aa | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                            }

                            // step up to next scanline
                            //
                            x0 -= xStep0;
                            z0 -= zStep0;
                            th0 -= thStep0;
                            tv0 -= tvStep0;
                            if(y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                th1 -= thStep1;
                                tv1 -= tvStep1;
                            }
                            else {
                                x2 -= xStep2;
                                z2 -= zStep2;
                                th2 -= thStep2;
                                tv2 -= tvStep2;
                            }
                            linebase -= w;
                        }
                    }

                    v1 = v2;
                    t1 = t2;
                } while (ibuf[j] != -1);

                j++;
            }
        }
    };

    /**
        Render the given mesh as textured object. Lighting will be calculated per vertex and then interpolated between and inside scanlines.
        @private
    */
    renderTextureSmooth(mesh) {
        var w = this.frameWidth;
        var h = this.frameHeight;
        var ibuf = mesh.indexBuffer;
        var vbuf = mesh.transformedVertexBuffer;
        var vnbuf = mesh.transformedVertexNormalZBuffer;
        var vnibuf = mesh.vertexNormalIndexBuffer ? mesh.vertexNormalIndexBuffer : mesh.indexBuffer;
        var fnbuf = mesh.transformedFaceNormalZBuffer;
        var cbuf = this.colorBuffer;
        var zbuf = this.zBuffer;
        var sbuf = this.selectionBuffer;
        var numOfFaces = mesh.faceCount;
        var id = mesh.internalId;
        var numOfVertices = vbuf.length / 3;
        var material = mesh.material ? mesh.material : this.defaultMaterial;
        var palette = material.getPalette();
        var texture = mesh.texture;
        var isOpaque = (material.transparency == 0) && !texture.hasTransparency;
        var matOpacity = ~~((1 - material.transparency) * 255);
        var tbuf = mesh.texCoordBuffer;
        var tibuf = mesh.texCoordIndexBuffer ? mesh.texCoordIndexBuffer : mesh.indexBuffer;
        var tdata = texture.data;
        var tdim = texture.width;
        var tbound = tdim - 1;
        var mipmaps = texture.hasMipmap() ? texture.mipmaps : null;
        var mipentries = mipmaps ? texture.mipentries : null;
        var drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if(material.transparency == 1)
            return;

        if(!vnbuf || vnbuf.length < mesh.vertexNormalBuffer.length/3) {
            mesh.transformedVertexNormalZBuffer = new Array(mesh.vertexNormalBuffer.length / 3);
            vnbuf = mesh.transformedVertexNormalZBuffer;
        }

        if(!fnbuf || fnbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            fnbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.vertexNormalBuffer, vnbuf);
        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, fnbuf);

        var Xs = new Array(3);
        var Ys = new Array(3);
        var Zs = new Array(3);
        var Ns = new Array(3);
        var THs = new Array(3);
        var TVs = new Array(3);
        var i = 0, j = 0;
        while(i < numOfFaces) {
            var xformedFNz = fnbuf[i++];
            if(drawBothSides)
                xformedFNz = xformedFNz > 0 ? xformedFNz : -xformedFNz;
            if(xformedFNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            }
            else {
                var i0, i1, i2;
                var v0, v1, v2;
                var t0, t1, t2;
                var ni0, ni1, ni2;
                i0 = ibuf[j];
                v0 = i0 * 3;
                t0 = tibuf[j] * 2;
                ni0 = vnibuf[j];
                j++;
                i1 = ibuf[j];
                v1 = i1 * 3;
                t1 = tibuf[j] * 2;
                ni1 = vnibuf[j];
                j++;

                if(mipmaps) {
                    v2 = ibuf[j] * 3;
                    t2 = tibuf[j] * 2;

                    tdim = texture.width;

                    Xs[0] = vbuf[v0    ];
                    Ys[0] = vbuf[v0 + 1];
                    Xs[1] = vbuf[v1    ];
                    Ys[1] = vbuf[v1 + 1];
                    Xs[2] = vbuf[v2    ];
                    Ys[2] = vbuf[v2 + 1];

                    THs[0] = tbuf[t0    ] * tdim;
                    TVs[0] = tbuf[t0 + 1] * tdim;
                    THs[1] = tbuf[t1    ] * tdim;
                    TVs[1] = tbuf[t1 + 1] * tdim;
                    THs[2] = tbuf[t2    ] * tdim;
                    TVs[2] = tbuf[t2 + 1] * tdim;

                    var faceArea = (Xs[1] - Xs[0]) * (Ys[2] - Ys[0]) - (Ys[1] - Ys[0]) * (Xs[2] - Xs[0]);
                    if(faceArea < 0)
                        faceArea = -faceArea;
                    faceArea += 1;
                    var texArea = (THs[1] - THs[0]) * (TVs[2] - TVs[0]) - (TVs[1] -  TVs[0]) * (THs[2] - THs[0]);
                    if(texArea < 0)
                        texArea = -texArea;
                    var mipRatio = texArea / faceArea;

                    var level = 0;
                    if(mipRatio < mipentries[1])
                        level = 0;
                    else if(mipRatio >= mipentries[mipentries.length - 1]) {
                        level = mipentries.length - 1;
                        tdim = 1;
                    }
                    else {
                        while(mipRatio >= mipentries[level+1]) {
                            level++;
                            tdim /= 2;
                        }
                    }

                    tdata = mipmaps[level];
                    tbound = tdim - 1;
                }

                do {
                    i2 = ibuf[j];
                    v2 = i2 * 3;
                    t2 = tibuf[j] * 2;
                    ni2 = vnibuf[j];
                    j++;

                    Xs[0] = ~~(vbuf[v0    ] + 0.5);
                    Ys[0] = ~~(vbuf[v0 + 1] + 0.5);
                    Zs[0] = vbuf[v0 + 2];
                    Xs[1] = ~~(vbuf[v1    ] + 0.5);
                    Ys[1] = ~~(vbuf[v1 + 1] + 0.5);
                    Zs[1] = vbuf[v1 + 2];
                    Xs[2] = ~~(vbuf[v2    ] + 0.5);
                    Ys[2] = ~~(vbuf[v2 + 1] + 0.5);
                    Zs[2] = vbuf[v2 + 2];

                    THs[0] = tbuf[t0    ] * tdim;
                    TVs[0] = tbuf[t0 + 1] * tdim;
                    THs[1] = tbuf[t1    ] * tdim;
                    TVs[1] = tbuf[t1 + 1] * tdim;
                    THs[2] = tbuf[t2    ] * tdim;
                    TVs[2] = tbuf[t2 + 1] * tdim;

                    Ns[0] = vnbuf[ni0];
                    Ns[1] = vnbuf[ni1];
                    Ns[2] = vnbuf[ni2];
                    if(drawBothSides) {
                        if(Ns[0] < 0)
                            Ns[0] = -Ns[0];
                        if(Ns[1] < 0)
                            Ns[1] = -Ns[1];
                        if(Ns[2] < 0)
                            Ns[2] = -Ns[2];
                    }

                    var high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    var low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    var mid = 3 - low - high;

                    if(high != low) {
                        var x0 = Xs[low];
                        var z0 = Zs[low];
                        var th0 = THs[low];
                        var tv0 = TVs[low];
                        var n0 = Ns[low] * 255;
                        var dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        var xStep0 = (Xs[low] - Xs[high]) / dy0;
                        var zStep0 = (Zs[low] - Zs[high]) / dy0;
                        var thStep0 = (THs[low] - THs[high]) / dy0;
                        var tvStep0 = (TVs[low] - TVs[high]) / dy0;
                        var nStep0 = (Ns[low] - Ns[high]) * 255 / dy0;

                        var x1 = Xs[low];
                        var z1 = Zs[low];
                        var th1 = THs[low];
                        var tv1 = TVs[low];
                        var n1 = Ns[low] * 255;
                        var dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        var xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        var zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        var thStep1 = (THs[low] - THs[mid]) / dy1;
                        var tvStep1 = (TVs[low] - TVs[mid]) / dy1;
                        var nStep1 = (Ns[low] - Ns[mid]) * 255 / dy1;

                        var x2 = Xs[mid];
                        var z2 = Zs[mid];
                        var th2 = THs[mid];
                        var tv2 = TVs[mid];
                        var n2 = Ns[mid] * 255;
                        var dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        var xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        var zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        var thStep2 = (THs[mid] - THs[high]) / dy2;
                        var tvStep2 = (TVs[mid] - TVs[high]) / dy2;
                        var nStep2 = (Ns[mid] - Ns[high]) * 255 / dy2;

                        var linebase = Ys[low] * w;
                        for(var y=Ys[low]; y>Ys[high]; y--) {
                            if(y >=0 && y < h) {
                                var xLeft = ~~x0;
                                var zLeft = z0;
                                var thLeft = th0;
                                var tvLeft = tv0;
                                var nLeft = n0;
                                var xRight, zRight, thRight, tvRight, nRight;
                                if(y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    thRight = th1;
                                    tvRight = tv1;
                                    nRight = n1;
                                }
                                else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    thRight = th2;
                                    tvRight = tv2;
                                    nRight = n2;
                                }

                                if(xLeft > xRight) {
                                    var temp;
                                    temp = xLeft;
                                    xLeft = xRight;
                                    xRight = temp;
                                    temp = zLeft;
                                    zLeft = zRight;
                                    zRight = temp;
                                    temp = thLeft;
                                    thLeft = thRight;
                                    thRight = temp;
                                    temp = tvLeft;
                                    tvLeft = tvRight;
                                    tvRight = temp;
                                    temp = nLeft;
                                    nLeft = nRight;
                                    nRight = temp;
                                }

                                var zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                var thInc = (xLeft != xRight) ? ((thRight - thLeft) / (xRight - xLeft)) : 1;
                                var tvInc = (xLeft != xRight) ? ((tvRight - tvLeft) / (xRight - xLeft)) : 1;
                                var nInc = (xLeft != xRight) ? ((nRight - nLeft) / (xRight - xLeft)) : 0;

                                if(xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    thLeft -= xLeft * thInc;
                                    tvLeft -= xLeft * tvInc;
                                    nLeft -= xLeft * nInc;
                                    xLeft = 0;
                                }
                                if(xRight >= w)
                                    xRight = w - 1;

                                var pix = linebase + xLeft;
                                if(isOpaque) {
                                    for(var x=xLeft, z=zLeft, n=nLeft, th=thLeft, tv=tvLeft; x<=xRight; x++, z+=zInc, n+=nInc, th+=thInc, tv+=tvInc) {
                                        if(z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            var color = palette[n > 0 ? (~~n) : 0];
                                            var texel = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            var rr = (((color & 0xff0000) >> 16) * ((texel & 0xff0000) >> 8));
                                            var gg = (((color & 0xff00) >> 8) * ((texel & 0xff00) >> 8));
                                            var bb = ((color & 0xff) * (texel & 0xff)) >> 8;
                                            cbuf[pix] = 0xff000000 | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                                else {
                                    for(var x=xLeft, z=zLeft, n=nLeft, th=thLeft, tv=tvLeft; x<xRight; x++, z+=zInc, n+=nInc, th+=thInc, tv+=tvInc) {
                                        if(z > zbuf[pix]) {
                                            var color = palette[n > 0 ? (~~n) : 0];
                                            var foreColor = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            var backColor = cbuf[pix];
                                            var opaci = (((foreColor >> 24) & 0xff) * (matOpacity & 0xff)) >> 8;
                                            var rr = (((color & 0xff0000) >> 16) * ((foreColor & 0xff0000) >> 8));
                                            var gg = (((color & 0xff00) >> 8) * ((foreColor & 0xff00) >> 8));
                                            var bb = ((color & 0xff) * (foreColor & 0xff)) >> 8;
                                            var aa = (backColor & 0xff000000) | (opaci << 24);
                                            if(opaci > 250) {
                                                zbuf[pix] = z;
                                            }
                                            else {
                                                var trans = 255 - opaci;
                                                rr = (rr * opaci + (backColor & 0xff0000) * trans) >> 8;
                                                gg = (gg * opaci + (backColor & 0xff00) * trans) >> 8;
                                                bb = (bb * opaci + (backColor & 0xff) * trans) >> 8;
                                            }
                                            cbuf[pix] = aa | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                            }

                            // step up to next scanline
                            //
                            x0 -= xStep0;
                            z0 -= zStep0;
                            th0 -= thStep0;
                            tv0 -= tvStep0;
                            n0 -= nStep0;
                            if(y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                th1 -= thStep1;
                                tv1 -= tvStep1;
                                n1 -= nStep1;
                            }
                            else {
                                x2 -= xStep2;
                                z2 -= zStep2;
                                th2 -= thStep2;
                                tv2 -= tvStep2;
                                n2 -= nStep2;
                            }
                            linebase -= w;
                        }
                    }

                    i1 = i2;
                    v1 = v2;
                    t1 = t2;
                    ni1 = ni2;
                } while (ibuf[j] != -1);

                j++;
            }
        }
    };

    /**
        Render the given mesh as solid object with sphere mapping. Lighting will be calculated per vertex and then interpolated between and inside scanlines.
        @private
    */
    renderSolidSphereMapped(mesh) {
        var w = this.frameWidth;
        var h = this.frameHeight;
        var ibuf = mesh.indexBuffer;
        var vbuf = mesh.transformedVertexBuffer;
        var vnbuf = mesh.transformedVertexNormalBuffer;
        var vnibuf = mesh.vertexNormalIndexBuffer ? mesh.vertexNormalIndexBuffer : mesh.indexBuffer;
        var fnbuf = mesh.transformedFaceNormalZBuffer;
        var cbuf = this.colorBuffer;
        var zbuf = this.zBuffer;
        var sbuf = this.selectionBuffer;
        var numOfFaces = mesh.faceCount;
        var numOfVertices = vbuf.length / 3;
        var id = mesh.internalId;
        var material = mesh.material ? mesh.material : this.defaultMaterial;
        var palette = material.getPalette();
        var sphereMap = this.sphereMap;
        var sdata = sphereMap.data;
        var sdim = sphereMap.width;
        var sbound = sdim - 1;
        var isOpaque = material.transparency == 0;
        var trans = ~~(material.transparency * 255);
        var opaci = 255 - trans;
        var drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if(material.transparency == 1)
            return;

        if(!vnbuf || vnbuf.length < mesh.vertexNormalBuffer.length) {
            mesh.transformedVertexNormalBuffer = new Array(mesh.vertexNormalBuffer.length);
            vnbuf = mesh.transformedVertexNormalBuffer;
        }

        if(!fnbuf || fnbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            fnbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectors(this.rotMatrix, mesh.vertexNormalBuffer, vnbuf);
        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, fnbuf);

        var Xs = new Array(3);
        var Ys = new Array(3);
        var Zs = new Array(3);
        var NXs = new Array(3);
        var NYs = new Array(3);
        var NZs = new Array(3);
        var i = 0, j = 0;
        while(i < numOfFaces) {
            var xformedFNz = fnbuf[i++];
            if(drawBothSides)
                xformedFNz = xformedFNz > 0 ? xformedFNz : -xformedFNz;
            if(xformedFNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            }
            else {
                var v0, v1, v2;
                var vn0, vn1, vn2;
                v0 = ibuf[j] * 3;
                vn0 = vnibuf[j] * 3;
                j++;
                v1 = ibuf[j] * 3;
                vn1 = vnibuf[j] * 3;
                j++;

                do {
                    v2 = ibuf[j] * 3;
                    vn2 = vnibuf[j] * 3;
                    j++;

                    Xs[0] = ~~(vbuf[v0    ] + 0.5);
                    Ys[0] = ~~(vbuf[v0 + 1] + 0.5);
                    Zs[0] = vbuf[v0 + 2];
                    Xs[1] = ~~(vbuf[v1    ] + 0.5);
                    Ys[1] = ~~(vbuf[v1 + 1] + 0.5);
                    Zs[1] = vbuf[v1 + 2];
                    Xs[2] = ~~(vbuf[v2    ] + 0.5);
                    Ys[2] = ~~(vbuf[v2 + 1] + 0.5);
                    Zs[2] = vbuf[v2 + 2];

                    NXs[0] = vnbuf[vn0    ];
                    NYs[0] = vnbuf[vn0 + 1];
                    NZs[0] = vnbuf[vn0 + 2];
                    NXs[1] = vnbuf[vn1    ];
                    NYs[1] = vnbuf[vn1 + 1];
                    NZs[1] = vnbuf[vn1 + 2];
                    NXs[2] = vnbuf[vn2    ];
                    NYs[2] = vnbuf[vn2 + 1];
                    NZs[2] = vnbuf[vn2 + 2];
                    if(drawBothSides) {
                        if(NZs[0] < 0)
                            NZs[0] = -NZs[0];
                        if(NZs[1] < 0)
                            NZs[1] = -NZs[1];
                        if(NZs[2] < 0)
                            NZs[2] = -NZs[2];
                    }

                    var high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    var low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    var mid = 3 - low - high;

                    if(high != low) {
                        var x0 = Xs[low];
                        var z0 = Zs[low];
                        var n0 = NZs[low] * 255;
                        var sh0 = ((NXs[low] / 2 + 0.5) * sdim) & sbound;
                        var sv0 = ((0.5 - NYs[low] / 2) * sdim) & sbound;
                        var dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        var xStep0 = (Xs[low] - Xs[high]) / dy0;
                        var zStep0 = (Zs[low] - Zs[high]) / dy0;
                        var nStep0 = (NZs[low] - NZs[high]) * 255 / dy0;
                        var shStep0 = (((NXs[low] - NXs[high]) / 2) * sdim) / dy0;
                        var svStep0 = (((NYs[high] - NYs[low]) / 2) * sdim) / dy0;

                        var x1 = Xs[low];
                        var z1 = Zs[low];
                        var n1 = NZs[low] * 255;
                        var sh1 = ((NXs[low] / 2 + 0.5) * sdim) & sbound;
                        var sv1 = ((0.5 - NYs[low] / 2) * sdim) & sbound;
                        var dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        var xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        var zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        var nStep1 = (NZs[low] - NZs[mid]) * 255 / dy1;
                        var shStep1 = (((NXs[low] - NXs[mid]) / 2) * sdim) / dy1;
                        var svStep1 = (((NYs[mid] - NYs[low]) / 2) * sdim) / dy1;

                        var x2 = Xs[mid];
                        var z2 = Zs[mid];
                        var n2 = NZs[mid] * 255;
                        var sh2 = ((NXs[mid] / 2 + 0.5) * sdim) & sbound;
                        var sv2 = ((0.5 - NYs[mid] / 2) * sdim) & sbound;
                        var dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        var xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        var zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        var nStep2 = (NZs[mid] - NZs[high]) * 255 / dy2;
                        var shStep2 = (((NXs[mid] - NXs[high]) / 2) * sdim) / dy2;
                        var svStep2 = (((NYs[high] - NYs[mid]) / 2) * sdim) / dy2;

                        var linebase = Ys[low] * w;
                        for(var y=Ys[low]; y>Ys[high]; y--) {
                            if(y >=0 && y < h) {
                                var xLeft = ~~x0;
                                var zLeft = z0;
                                var nLeft = n0;
                                var shLeft = sh0;
                                var svLeft = sv0;
                                var xRight, zRight, nRight, shRight, svRight;
                                if(y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    nRight = n1;
                                    shRight = sh1;
                                    svRight = sv1;
                                }
                                else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    nRight = n2;
                                    shRight = sh2;
                                    svRight = sv2;
                                }

                                if(xLeft > xRight) {
                                    var temp;
                                    temp = xLeft;
                                    xLeft = xRight;
                                    xRight = temp;
                                    temp = zLeft;
                                    zLeft = zRight;
                                    zRight = temp;
                                    temp = nLeft;
                                    nLeft = nRight;
                                    nRight = temp;
                                    temp = shLeft;
                                    shLeft = shRight;
                                    shRight = temp;
                                    temp = svLeft;
                                    svLeft = svRight;
                                    svRight = temp;
                                }

                                var zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                var nInc = (xLeft != xRight) ? ((nRight - nLeft) / (xRight - xLeft)) : 1;
                                var shInc = (xLeft != xRight) ? ((shRight - shLeft) / (xRight - xLeft)) : 1;
                                var svInc = (xLeft != xRight) ? ((svRight - svLeft) / (xRight - xLeft)) : 1;
                                if(xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    nLeft -= xLeft * nInc;
                                    shLeft -= shLeft * shInc;
                                    svLeft -= svLeft * svInc;
                                    xLeft = 0;
                                }
                                if(xRight >= w) {
                                    xRight = w - 1;
                                }
                                var pix = linebase + xLeft;
                                if(isOpaque) {
                                    for(var x=xLeft, z=zLeft, n=nLeft, sh=shLeft, sv=svLeft; x<=xRight; x++, z+=zInc, n+=nInc, sh+=shInc, sv+=svInc) {
                                        if(z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            var color = palette[n > 0 ? (~~n) : 0];
                                            var stexel = sdata[(sv & sbound) * sdim + (sh & sbound)];
                                            var rr = (((color & 0xff0000) >> 16) * ((stexel & 0xff0000) >> 8));
                                            var gg = (((color & 0xff00) >> 8) * ((stexel & 0xff00) >> 8));
                                            var bb = ((color & 0xff) * (stexel & 0xff)) >> 8;
                                            cbuf[pix] = 0xff000000 | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                                else {
                                    for(var x=xLeft, z=zLeft, n=nLeft, sh=shLeft, sv=svLeft; x<xRight; x++, z+=zInc, n+=nInc, sh+=shInc, sv+=svInc) {
                                        if(z > zbuf[pix]) {
                                            var color = palette[n > 0 ? (~~n) : 0];
                                            var foreColor = sdata[(sv & sbound) * sdim + (sh & sbound)];
                                            var backColor = cbuf[pix];
                                            var rr = (((color & 0xff0000) >> 16) * ((foreColor & 0xff0000) >> 8));
                                            var gg = (((color & 0xff00) >> 8) * ((foreColor & 0xff00) >> 8));
                                            var bb = ((color & 0xff) * (foreColor & 0xff)) >> 8;
                                            var aa = (backColor | color) & 0xff000000;
                                            rr = (rr * opaci + (backColor & 0xff0000) * trans) >> 8;
                                            gg = (gg * opaci + (backColor & 0xff00) * trans) >> 8;
                                            bb = (bb * opaci + (backColor & 0xff) * trans) >> 8;
                                            cbuf[pix] = aa | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                }
                            }

                            // step up to next scanline
                            //
                            x0 -= xStep0;
                            z0 -= zStep0;
                            n0 -= nStep0;
                            sh0 -= shStep0;
                            sv0 -= svStep0;
                            if(y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                n1 -= nStep1;
                                sh1 -= shStep1;
                                sv1 -= svStep1;
                            }
                            else {
                                x2 -= xStep2;
                                z2 -= zStep2;
                                n2 -= nStep2;
                                sh2 -= shStep2;
                                sv2 -= svStep2;
                            }
                            linebase -= w;
                        }
                    }

                    v1 = v2;
                    vn1 = vn2;
                } while (ibuf[j] != -1);

                j++;
            }
        }
    }
}