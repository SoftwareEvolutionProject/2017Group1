
import { LoaderSelector } from './LoaderSelector';
import { Material } from './Material';
import { Math3D } from './Math3D';
import { Matrix3x4 } from './Matrix';
import { PickInfo } from './PickInfo';
import { PlatformInfo } from './PlatformInfo';
import { Texture } from './Texture';
import { WebGLRenderBackend } from './WebGLRenderBackend';

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
        if (parameters) {
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
                LocalBuffers:		parameters.LocalBuffers || 'retain',
            };
        } else {
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
                LocalBuffers: 'retain',
            };
        }

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
        let self = this;
        if (!this.platformInfo.isTouchDevice) {
            this.canvas.addEventListener('mousedown', function(e) {self.mouseDownHandler(e); }, false);
            this.canvas.addEventListener('mouseup', function(e) {self.mouseUpHandler(e); }, false);
            this.canvas.addEventListener('mousemove', function(e) {self.mouseMoveHandler(e); }, false);
            this.canvas.addEventListener(this.platformInfo.browser == 'firefox' ? 'DOMMouseScroll' : 'mousewheel',
                                        function(e) {self.mouseWheelHandler(e); }, false);
            document.addEventListener('keydown', function(e) {self.keyDownHandler(e); }, false);
            document.addEventListener('keyup', function(e) {self.keyUpHandler(e); }, false);
        } else {
            this.canvas.addEventListener('touchstart', function(e) {self.touchStartHandler(e); }, false);
            this.canvas.addEventListener('touchend', function(e) {self.touchEndHandler(e); }, false);
            this.canvas.addEventListener('touchmove', function(e) {self.touchMoveHandler(e); }, false);
        }
    }

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
    }

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
        } catch (e) {}

        if (this.canvas.width <= 2 || this.canvas.height <= 2) {
            this.definition = 'standard';
        }

        // calculate dimensions of frame buffers
        switch (this.definition) {
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
        let self = this;
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
    }

    /**
        Ask viewer to render a new frame or just repaint last frame.
        @param {Boolean} repaintOnly true to repaint last frame; false(default) to render a new frame.
    */
    update(repaintOnly = false) {
        if (this.isFailed) {
            return;
        }

        if (repaintOnly) {
            this.needRepaint = true;
        } else {
            this.needUpdate = true;
        }
    }

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
    }

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
    }

    /**
        Set quality level of rendering.<br />
        Available quality levels are:<br />
        '<b>low</b>':      low-quality rendering will be applied, with highest performance;<br />
        '<b>standard</b>': normal-quality rendering will be applied, with modest performace;<br />
        '<b>high</b>':     high-quality rendering will be applied, with lowest performace.<br />
        @params {String} definition new quality level.
    */
    setDefinition(definition) {
        if (this.canvas.width <= 2 || this.canvas.height <= 2) {
            definition = 'standard';
        }

        if (definition == this.definition) {
            return;
        }

        this.params['Definition'] = definition;
        this.definition = definition;

        let oldFrameWidth = this.frameWidth;

        switch (this.definition) {
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

        let ratio = this.frameWidth / oldFrameWidth;
        // zoom factor should be adjusted, otherwise there would be an abrupt zoom-in or zoom-out on next frame
        this.zoomFactor *= ratio;
        // likewise, panning should also be adjusted to avoid abrupt jump on next frame
        this.panning[0] *= ratio;
        this.panning[1] *= ratio;
    }

    /**
        Specify the url for the background image.
        @param {String} backgroundImageUrl url string for the background image.
    */
    setBackgroudImageFromUrl(backgroundImageUrl) {
        this.params['BackgroundImageUrl'] = backgroundImageUrl;
        this.bkgImageUrl = backgroundImageUrl;

        if (backgroundImageUrl == '') {
            this.bkgImage = null;
            return;
        }

        let self = this;
        let img = new Image;

        img.onload = function() {
            self.bkgImage = this;
            self.generateBackground();
        };

        img.crossOrigin = 'anonymous'; // explicitly enable cross-domain image
        img.src = encodeURI(backgroundImageUrl);
    }

    /**
        Specify a new image from the given url which will be used for applying sphere mapping.
        @param {String} sphereMapUrl url string that describes where to load the image.
    */
    setSphereMapFromUrl(sphereMapUrl) {
        this.params['SphereMapUrl'] = sphereMapUrl;
        this.sphereMapUrl = sphereMapUrl;

        if (sphereMapUrl == '') {
            this.sphereMap = null;
            return;
        }

        let self = this;
        let newMap = new Texture(null, null);

        newMap.onready = function() {
            self.sphereMap = newMap;
            self.update();
        };

        newMap.createFromUrl(this.sphereMapUrl, null);
    }

    /**
        Enable/Disable the default mouse and key event handling routines.
        @param {Boolean} enabled true to enable the default handler; false to disable them.
    */
    enableDefaultInputHandler(enabled) {
        this.isDefaultInputHandlerEnabled = enabled;
    }

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
    }

    /**
        Check if WebGL is enabled for rendering.
        @returns {Boolean} true if WebGL is enabled; false if WebGL is not enabled or unavailable.
    */
    isWebGLEnabled() {
        return this.webglBackend != null;
    }

    /**
        Load a new scene from the given url to replace the current scene.
        @param {String} sceneUrl url string that describes where to load the new scene.
    */
    replaceSceneFromUrl(sceneUrl) {
        this.params['SceneUrl'] = sceneUrl;
        this.sceneUrl = sceneUrl;
        this.isFailed = this.isLoaded = false;
        this.loadScene();
    }

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
    }

    /**
        Reset the current scene to its initial state.
    */
    resetScene() {
        let d = (!this.scene || this.scene.isEmpty()) ? 0 : this.scene.aabb.lengthOfDiagonal();
        this.zoomFactor = (d == 0) ? 1 : (this.frameWidth < this.frameHeight ? this.frameWidth : this.frameHeight) / d;
        this.panning = [0, 0];
        this.rotMatrix.identity();
        this.rotMatrix.rotateAboutXAxis(this.initRotX);
        this.rotMatrix.rotateAboutYAxis(this.initRotY);
        this.rotMatrix.rotateAboutZAxis(this.initRotZ);
    }

    /**
        Get the current scene.
        @returns {JSC3D.Scene} the current scene.
    */
    getScene() {
        return this.scene;
    }

    /**
        Query information at a given position on the canvas.
        @param {Number} clientX client x coordinate on the current page.
        @param {Number} clientY client y coordinate on the current page.
        @returns {JSC3D.PickInfo} a PickInfo object which holds the result.
    */
    pick(clientX, clientY) {
        let pickInfo = new PickInfo;

        let canvasRect = this.canvas.getBoundingClientRect();
        let canvasX = clientX - canvasRect.left;
        let canvasY = clientY - canvasRect.top;

        pickInfo.canvasX = canvasX;
        pickInfo.canvasY = canvasY;

        let pickedId = 0;
        pickedId = this.webglBackend.pick(canvasX, canvasY);

        if (pickedId > 0) {
            let meshes = this.scene.getChildren();
            for (let i = 0; i < meshes.length; i++) {
                if (meshes[i].internalId == pickedId) {
                    pickInfo.mesh = meshes[i];
                    break;
                }
            }
        }

        return pickInfo;
    }

    /**
        Render a new frame or repaint last frame.
        @private
    */
    doUpdate() {
        if (this.needUpdate || this.needRepaint) {
            if (this.beforeupdate != null && (typeof this.beforeupdate) == 'function') {
                this.beforeupdate();
            }

            if (this.scene) {
                /*
                * Render a new frame or just redraw last frame.
                */
                if (this.needUpdate) {
                    this.beginScene();
                    this.render();
                    this.endScene();
                }
                this.paint();
            } else {
                // Only need to redraw the background since there is nothing to render.
                this.drawBackground();
            }

            // clear dirty flags
            this.needRepaint = false;
            this.needUpdate = false;

            if (this.afterupdate != null && (typeof this.afterupdate) == 'function') {
                this.afterupdate();
            }
        }
    }

    /**
        Paint onto canvas.
        @private
    */
    paint() {
        return;
    }

    /**
        The mouseDown event handling routine.
        @private
    */
    mouseDownHandler(e) {
        if (!this.isLoaded) {
            return;
        }

        if (this.onmousedown) {
            let info = this.pick(e.clientX, e.clientY);
            this.onmousedown(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
        }

        e.preventDefault();
        e.stopPropagation();

        if (!this.isDefaultInputHandlerEnabled) {
            return;
        }

        this.buttonStates[e.button] = true;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.mouseDownX = e.clientX;
        this.mouseDownY = e.clientY;
    }

    /**
        The mouseUp event handling routine.
        @private
    */
    mouseUpHandler(e) {
        if (!this.isLoaded) {
            return;
        }

        let info;
        if (this.onmouseup || this.onmouseclick) {
            info = this.pick(e.clientX, e.clientY);
        }

        if (this.onmouseup) {
            this.onmouseup(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
        }

        if (this.onmouseclick && this.mouseDownX == e.clientX && this.mouseDownY == e.clientY) {
            this.onmouseclick(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
            this.mouseDownX = -1;
            this.mouseDownY = -1;
        }

        e.preventDefault();
        e.stopPropagation();

        if (!this.isDefaultInputHandlerEnabled) {
            return;
        }

        this.buttonStates[e.button] = false;
    }

    /**
        The mouseMove event handling routine.
        @private
    */
    mouseMoveHandler(e) {
        if (!this.isLoaded) {
            return;
        }

        if (this.onmousemove) {
            let info = this.pick(e.clientX, e.clientY);
            this.onmousemove(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
        }

        e.preventDefault();
        e.stopPropagation();

        if (!this.isDefaultInputHandlerEnabled) {
            return;
        }

        let isDragging = this.buttonStates[0] == true;
        let isShiftDown = this.keyStates[0x10] == true;
        let isCtrlDown = this.keyStates[0x11] == true;
        if (isDragging) {
            if ((isShiftDown && this.mouseUsage == 'default') || this.mouseUsage == 'zoom') {
                this.zoomFactor *= this.mouseY <= e.clientY ? 1.04 : 0.96;
            } else if ((isCtrlDown && this.mouseUsage == 'default') || this.mouseUsage == 'pan') {
                let ratio = (this.definition == 'low') ? 0.5 : ((this.definition == 'high') ? 2 : 1);
                this.panning[0] += ratio * (e.clientX - this.mouseX);
                this.panning[1] += ratio * (e.clientY - this.mouseY);
            } else if (this.mouseUsage == 'default' || this.mouseUsage == 'rotate') {
                let rotX = (e.clientY - this.mouseY) * 360 / this.canvas.width;
                let rotY = (e.clientX - this.mouseX) * 360 / this.canvas.height;
                this.rotMatrix.rotateAboutXAxis(rotX);
                this.rotMatrix.rotateAboutYAxis(rotY);
            }
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.mouseDownX = -1;
            this.mouseDownY = -1;
            this.update();
        }
    }

    mouseWheelHandler(e) {
        if (!this.isLoaded) {
            return;
        }

        if (this.onmousewheel) {
            let info = this.pick(e.clientX, e.clientY);
            this.onmousewheel(info.canvasX, info.canvasY, e.button, info.depth, info.mesh);
        }

        e.preventDefault();
        e.stopPropagation();

        if (!this.isDefaultInputHandlerEnabled) {
            return;
        }

        this.mouseDownX = -1;
        this.mouseDownY = -1;

        this.zoomFactor *= (this.platformInfo.browser == 'firefox' ? -e.detail : e.wheelDelta) < 0 ? 1.1 : 0.91;
        this.update();
    }

    /**
        The touchStart event handling routine. This is for compatibility for touch devices.
        @private
    */
    touchStartHandler(e) {
        if (!this.isLoaded) {
            return;
        }

        if (e.touches.length > 0) {
            let clientX = e.touches[0].clientX;
            let clientY = e.touches[0].clientY;

            if (this.onmousedown) {
                let info = this.pick(clientX, clientY);
                this.onmousedown(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            }

            e.preventDefault();
            e.stopPropagation();

            if (!this.isDefaultInputHandlerEnabled) {
                return;
            }

            this.buttonStates[0] = true;
            this.mouseX = clientX;
            this.mouseY = clientY;
            this.mouseDownX = clientX;
            this.mouseDownY = clientY;
        }
    }

    /**
        The touchEnd event handling routine. This is for compatibility for touch devices.
        @private
    */
    touchEndHandler(e) {
        if (!this.isLoaded) {
            return;
        }

        let info;
        if (this.onmouseup || this.onmouseclick) {
            info = this.pick(this.mouseX, this.mouseY);
        }

        if (this.onmouseup) {
            this.onmouseup(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
        }

        if (this.onmouseclick && this.mouseDownX == e.touches[0].clientX && this.mouseDownY == e.touches[0].clientY) {
            this.onmouseclick(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            this.mouseDownX = -1;
            this.mouseDownY = -1;
        }

        e.preventDefault();
        e.stopPropagation();

        if (!this.isDefaultInputHandlerEnabled) {
            return;
        }

        this.buttonStates[0] = false;
    }

    /**
        The touchMove event handling routine. This is for compatibility for touch devices.
        @private
    */
    touchMoveHandler(e) {
        if (!this.isLoaded) {
            return;
        }

        if (e.touches.length > 0) {
            let clientX = e.touches[0].clientX;
            let clientY = e.touches[0].clientY;

            if (this.onmousemove) {
                let info = this.pick(clientX, clientY);
                this.onmousemove(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            }

            e.preventDefault();
            e.stopPropagation();

            if (!this.isDefaultInputHandlerEnabled) {
                return;
            }

            if (this.mouseUsage == 'zoom') {
                this.zoomFactor *= (this.mouseY <= clientY) ? 1.04 : 0.96;
            } else if (this.mouseUsage == 'pan') {
                let ratio = (this.definition == 'low') ? 0.5 : ((this.definition == 'high') ? 2 : 1);
                this.panning[0] += ratio * (clientX - this.mouseX);
                this.panning[1] += ratio * (clientY - this.mouseY);
            } else if (this.mouseUsage == 'default' || this.mouseUsage == 'rotate') {
                let rotX = (clientY - this.mouseY) * 360 / this.canvas.width;
                let rotY = (clientX - this.mouseX) * 360 / this.canvas.height;
                this.rotMatrix.rotateAboutXAxis(rotX);
                this.rotMatrix.rotateAboutYAxis(rotY);
            }
            this.mouseX = clientX;
            this.mouseY = clientY;
            this.mouseDownX = -1;
            this.mouseDownY = -1;

            this.update();
        }
    }

    /**
        The keyDown event handling routine.
        @private
    */
    keyDownHandler(e) {
        if (!this.isDefaultInputHandlerEnabled) {
            return;
        }

        this.keyStates[e.keyCode] = true;
    }

    /**
        The keyUp event handling routine.
        @private
    */
    keyUpHandler(e) {
        if (!this.isDefaultInputHandlerEnabled) {
            return;
        }

        this.keyStates[e.keyCode] = false;
    }

    /**
        The gesture event handling routine which implements gesture-based control on touch devices.
        This is based on Hammer.js gesture event implementation.
        @private
    */
    gestureHandler(e) {
        if (!this.isLoaded) {
            return;
        }

        let clientX = e.gesture.center.pageX - document.body.scrollLeft;
        let clientY = e.gesture.center.pageY - document.body.scrollTop;
        let info = this.pick(clientX, clientY);

        switch (e.type) {
        case 'touch':
            if (this.onmousedown) {
                this.onmousedown(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            }
            this.baseZoomFactor = this.zoomFactor;
            this.mouseX = clientX;
            this.mouseY = clientY;
            this.mouseDownX = clientX;
            this.mouseDownY = clientY;
            break;
        case 'release':
            if (this.onmouseup) {
                this.onmouseup(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            }
            if (this.onmouseclick && this.mouseDownX == clientX && this.mouseDownY == clientY) {
                this.onmouseclick(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            }
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
            if (this.onmousemove) {
                this.onmousemove(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            }
            if (!this.isDefaultInputHandlerEnabled) {
                break;
            }
            if (this.isTouchHeld) {						// pan
                let ratio = (this.definition == 'low') ? 0.5 : ((this.definition == 'high') ? 2 : 1);
                this.panning[0] += ratio * (clientX - this.mouseX);
                this.panning[1] += ratio * (clientY - this.mouseY);
            } else if (!this.suppressDraggingRotation) {	// rotate
                let rotX = (clientY - this.mouseY) * 360 / this.canvas.width;
                let rotY = (clientX - this.mouseX) * 360 / this.canvas.height;
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
            if (this.onmousewheel) {
                this.onmousewheel(info.canvasX, info.canvasY, 0, info.depth, info.mesh);
            }
            if (!this.isDefaultInputHandlerEnabled) {
                break;
            }
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
            let self = this;
            setTimeout(function() {
                self.suppressDraggingRotation = false;
            }, 250);
            break;
        default:
            break;
        }

        e.gesture.preventDefault();
        e.gesture.stopPropagation();
    }

    /**
        Internally load a scene.
        @private
    */
    loadScene() {
        // terminate current loading if it is not finished yet
        if (this.abortUnfinishedLoadingFn) {
            this.abortUnfinishedLoadingFn();
        }

        this.scene = null;
        this.isLoaded = false;

        this.update();

        if (this.sceneUrl == '') {
            return false;
        }

        /*
        * Discard the query part of the URL string, if any, to get the correct file name.
        * By negatif@gmail.com
        */
        let questionMarkAt = this.sceneUrl.indexOf('?');
        let sceneUrlNoQuery = questionMarkAt == -1 ? this.sceneUrl : this.sceneUrl.substring(0, questionMarkAt);

        let lastSlashAt = sceneUrlNoQuery.lastIndexOf('/');
        if (lastSlashAt == -1) {
            lastSlashAt = sceneUrlNoQuery.lastIndexOf('\\');
        }

        let fileName = sceneUrlNoQuery.substring(lastSlashAt + 1);
        let lastDotAt = fileName.lastIndexOf('.');
        if (lastDotAt == -1) {
            return false;
        }

        let fileExtName = fileName.substring(lastDotAt + 1);

        if (!this.loader) {
            return false;
        }

        let self = this;

        this.loader.onload = function(scene) {
            self.abortUnfinishedLoadingFn = null;
            self.setupScene(scene);
            if (self.onloadingcomplete && (typeof self.onloadingcomplete) == 'function') {
                self.onloadingcomplete();
            }
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
            if (self.onloadingerror && (typeof self.onloadingerror) == 'function') {
                self.onloadingerror(errorMsg);
            }
        };

        this.loader.onprogress = function(task, prog) {
            if (self.showProgressBar) {
                self.reportProgress(task, prog);
            }
            if (self.onloadingprogress && (typeof self.onloadingprogress) == 'function') {
                self.onloadingprogress(task, prog);
            }
        };

        this.loader.onresource = function(resource) {
            if ((resource instanceof Texture) && self.isMipMappingOn && !resource.hasMipmap()) {
                resource.generateMipmaps();
            }
            self.update();
        };

        this.abortUnfinishedLoadingFn = function() {
            this.loader.abort();
            self.abortUnfinishedLoadingFn = null;
            self.hideProgress();
            if (self.onloadingaborted && (typeof self.onloadingaborted) == 'function') {
                self.onloadingaborted();
            }
        };

        this.loader.loadFromUrl(this.sceneUrl);

        if (this.onloadingstarted && (typeof this.onloadingstarted) == 'function') {
            this.onloadingstarted();
        }

        return true;
    }

    /**
        Prepare for rendering of a new scene.
        @private
    */
    setupScene(scene) {
        // crease-angle should be applied onto each mesh before their initialization
        if (this.creaseAngle >= 0) {
            let cAngle = this.creaseAngle;
            scene.forEachChild(function(mesh) {
                mesh.creaseAngle = cAngle;
            });
        }

        scene.init();

        if (!scene.isEmpty()) {
            let d = scene.aabb.lengthOfDiagonal();
            let w = this.frameWidth;
            let h = this.frameHeight;
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
    }

    /**
        Show progress with information on current time-cosuming task.
        @param {String} task text information about current task.
        @param {Number} progress progress of current task. this should be a number between 0 and 1.
    */
    reportProgress(task, progress) {
        if (!this.progressFrame) {
            let canvasRect = this.canvas.getBoundingClientRect();

            let r = 255 - ((this.bkgColor1 & 0xff0000) >> 16);
            let g = 255 - ((this.bkgColor1 & 0xff00) >> 8);
            let b = 255 - (this.bkgColor1 & 0xff);
            let color = 'rgb(' + r + ',' + g + ',' + b + ')';

            let barX = window.pageXOffset + canvasRect.left + 40;
            let barY = window.pageYOffset + canvasRect.top  + canvasRect.height * 0.38;
            let barWidth = canvasRect.width - (barX - canvasRect.left) * 2;
            let barHeight = 20;

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

            if (!this.messagePanel) {
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

        if (this.progressFrame.style.display != 'block') {
            this.progressFrame.style.display = 'block';
            this.progressRectangle.style.display = 'block';
        }
        if (task && this.messagePanel.style.display != 'block') {
            this.messagePanel.style.display = 'block';
        }

        this.progressRectangle.style.width = (parseFloat(this.progressFrame.style.width) - 4) * progress + 'px';
        this.messagePanel.innerHTML = task;
    }

    /**
        Hide the progress bar.
        @private
    */
    hideProgress() {
        if (this.progressFrame) {
            this.messagePanel.style.display = 'none';
            this.progressFrame.style.display = 'none';
            this.progressRectangle.style.display = 'none';
        }
    }

    /**
        Show information about a fatal error.
        @param {String} message text information about this error.
    */
    reportError(message) {
        if (!this.messagePanel) {
            let canvasRect = this.canvas.getBoundingClientRect();

            let r = 255 - ((this.bkgColor1 & 0xff0000) >> 16);
            let g = 255 - ((this.bkgColor1 & 0xff00) >> 8);
            let b = 255 - (this.bkgColor1 & 0xff);
            let color = 'rgb(' + r + ',' + g + ',' + b + ')';

            let panelX = window.pageXOffset + canvasRect.left + 40;
            let panelY = window.pageYOffset + canvasRect.top  + canvasRect.height * 0.38;
            let panelWidth = canvasRect.width - (panelX - canvasRect.left) * 2;
            let panelHeight = 14;

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
        if (this.progressFrame.style.display != 'none') {
            this.progressFrame.style.display = 'none';
            this.progressRectangle.style.display = 'none';
        }

        if (message && this.messagePanel.style.display != 'block') {
            this.messagePanel.style.display = 'block';
        }

        this.messagePanel.innerHTML = message;
    }

    /**
        Hide the error message.
        @private
    */
    hideError() {
        if (this.messagePanel) {
            this.messagePanel.style.display = 'none';
        }
    }

    /**
        Fill the background color buffer.
        @private
    */
    generateBackground() {
        if (this.bkgImage) {
            this.webglBackend.setBackgroundImage(this.bkgImage);
        } else {
            this.webglBackend.setBackgroundColors(this.bkgColor1, this.bkgColor2);
        }
    }

    /**
        Do fill the background color buffer with gradient colors.
        @private
    */
    fillGradientBackground() {
        let w = this.frameWidth;
        let h = this.frameHeight;
        let pixels = this.bkgColorBuffer;

        let r1 = (this.bkgColor1 & 0xff0000) >> 16;
        let g1 = (this.bkgColor1 & 0xff00) >> 8;
        let b1 = this.bkgColor1 & 0xff;
        let r2 = (this.bkgColor2 & 0xff0000) >> 16;
        let g2 = (this.bkgColor2 & 0xff00) >> 8;
        let b2 = this.bkgColor2 & 0xff;

        let alpha = this.isBackgroundOn ? 0xff000000 : 0;

        let pix = 0;
        for (let i = 0; i < h; i++) {
            let r = (r1 + i * (r2 - r1) / h) & 0xff;
            let g = (g1 + i * (g2 - g1) / h) & 0xff;
            let b = (b1 + i * (b2 - b1) / h) & 0xff;

            for (let j = 0; j < w; j++) {
                pixels[pix++] = alpha | r << 16 | g << 8 | b;
            }
        }
    }

    /**
        Do fill the background color buffer with a loaded image.
        @private
        TODO: This function have some reference to old JSC3D Texture class. FIX!!!!
    */
    fillBackgroundWithImage() {
        //TODO: REMOVE This function probably.
    }

    /**
        Draw background onto canvas.
        @private
    */
    drawBackground() {
        this.beginScene();
        this.endScene();

        this.paint();
    }

    /**
        Begin to render a new frame.
        @private
    */
    beginScene() {
        this.webglBackend.beginFrame(this.definition, this.isBackgroundOn);
        return;
    }

    /**
        End for rendering of a frame.
        @private
    */
    endScene() {
        this.webglBackend.endFrame();
    }

    /**
        Render a new frame.
        @private
    */
    render() {
        if (this.scene.isEmpty()) {
            return;
        }

        let aabb = this.scene.aabb;

        // calculate transformation matrix
        let w = this.frameWidth;
        let h = this.frameHeight;
        let d = aabb.lengthOfDiagonal();

        this.transformMatrix.identity();
        this.transformMatrix.translate(-0.5 * (aabb.minX + aabb.maxX), -0.5 * (aabb.minY + aabb.maxY), -0.5 * (aabb.minZ + aabb.maxZ));
        this.transformMatrix.multiply(this.rotMatrix);
        this.transformMatrix.scale(2 * this.zoomFactor / w, 2 * this.zoomFactor / h, -2 / d);
        this.transformMatrix.translate(2 * this.panning[0] / w, -2 * this.panning[1] / h, 0);

        // sort meshes into a render list
        let renderList = this.sortScene(this.transformMatrix);

        // delegate to WebGL backend to do the rendering
        this.webglBackend.render(this.scene.getChildren(), this.transformMatrix, this.rotMatrix, this.renderMode, this.defaultMaterial, this.sphereMap, this.isCullingDisabled);
    }

    /**
        Sort meshes inside the scene into a render list. The sorting criterion is a mixture of trnasparency and depth.
        This routine is necessary to ensure a correct rendering order. It also helps to reduce fill rate.
        @private
    */
    sortScene(mat) {
        let renderList = [];

        let meshes = this.scene.getChildren();
        for (let i = 0; i < meshes.length; i++) {
            let mesh = meshes[i];
            if (!mesh.isTrivial()) {
                renderList.push(mesh);
                let meshCenter = mesh.aabb.center();
                new Math3D().transformVectors(mat, meshCenter, meshCenter);
                let meshMaterial = mesh.material ? mesh.material : this.defaultMaterial;
                mesh.sortKey = {
                    depth: meshCenter[2],
                    isTransparnt: (meshMaterial.transparency > 0) || (mesh.hasTexture() ? mesh.texture.hasTransparency : false),
                };
            }
        }

        renderList.sort(
            function(mesh0, mesh1) {
                // opaque meshes should always be prior to transparent ones to be rendered
                if (!mesh0.sortKey.isTransparnt && mesh1.sortKey.isTransparnt) {
                    return -1;
                }

                // opaque meshes should always be prior to transparent ones to be rendered
                if (mesh0.sortKey.isTransparnt && !mesh1.sortKey.isTransparnt) {
                    return 1;
                }

                // transparent meshes should be rendered from far to near
                if (mesh0.sortKey.isTransparnt) {
                    return mesh0.sortKey.depth - mesh1.sortKey.depth;
                }

                // opaque meshes should be rendered form near to far
                return mesh1.sortKey.depth - mesh0.sortKey.depth;
        } );

        return renderList;
    }

    /**
        Render the given mesh as points.
        @private
    */
    renderPoint(mesh) {
        let w = this.frameWidth;
        let h = this.frameHeight;
        let xbound = w - 1;
        let ybound = h - 1;
        let ibuf = mesh.indexBuffer;
        let vbuf = mesh.transformedVertexBuffer;
        let cbuf = this.colorBuffer;
        let zbuf = this.zBuffer;
        let sbuf = this.selectionBuffer;
        let numOfVertices = vbuf.length / 3;
        let id = mesh.internalId;
        let color = 0xff000000 | (mesh.material ? mesh.material.diffuseColor : this.defaultMaterial.diffuseColor);

        for (let i = 0, j = 0; i < numOfVertices; i++, j += 3) {
            let x = ~~(vbuf[j    ] + 0.5);
            let y = ~~(vbuf[j + 1] + 0.5);
            let z = vbuf[j + 2];
            if (x >= 0 && x < xbound && y >= 0 && y < ybound) {
                let pix = y * w + x;
                if (z > zbuf[pix]) {
                    zbuf[pix] = z;
                    cbuf[pix] = color;
                    sbuf[pix] = id;
                }
                pix++;
                if (z > zbuf[pix]) {
                    zbuf[pix] = z;
                    cbuf[pix] = color;
                    sbuf[pix] = id;
                }
                pix += xbound;
                if (z > zbuf[pix]) {
                    zbuf[pix] = z;
                    cbuf[pix] = color;
                    sbuf[pix] = id;
                }
                pix++;
                if (z > zbuf[pix]) {
                    zbuf[pix] = z;
                    cbuf[pix] = color;
                    sbuf[pix] = id;
                }
            }
        }
    }

    /**
        Render the given mesh as wireframe.
        @private
    */
    renderWireframe(mesh) {
        let w = this.frameWidth;
        let h = this.frameHeight;
        let xbound = w - 1;
        let ybound = h - 1;
        let ibuf = mesh.indexBuffer;
        let vbuf = mesh.transformedVertexBuffer;
        let nbuf = mesh.transformedFaceNormalZBuffer;
        let cbuf = this.colorBuffer;
        let zbuf = this.zBuffer;
        let sbuf = this.selectionBuffer;
        let numOfFaces = mesh.faceCount;
        let id = mesh.internalId;
        let color = 0xff000000 | (mesh.material ? mesh.material.diffuseColor : this.defaultMaterial.diffuseColor);
        let drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        if (!nbuf || nbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            nbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, nbuf);

        let i = 0, j = 0;
        while (i < numOfFaces) {
            let xformedNz = nbuf[i++];
            if (drawBothSides) {
                xformedNz = xformedNz > 0 ? xformedNz : -xformedNz;
            }
            if (xformedNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            } else {
                let vStart, v0, v1;
                v0 = ibuf[j++] * 3;
                v1 = ibuf[j++] * 3;
                vStart = v0;

                let isClosed = false;
                while (!isClosed) {
                    let x0 = ~~(vbuf[v0    ] + 0.5);
                    let y0 = ~~(vbuf[v0 + 1] + 0.5);
                    let z0 = vbuf[v0 + 2];
                    let x1 = ~~(vbuf[v1    ] + 0.5);
                    let y1 = ~~(vbuf[v1 + 1] + 0.5);
                    let z1 = vbuf[v1 + 2];

                    let dx = x1 - x0;
                    let dy = y1 - y0;
                    let dz = z1 - z0;

                    let dd;
                    let xInc, yInc, zInc;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        dd = dx;
                        xInc = dx > 0 ? 1 : -1;
                        yInc = dx != 0 ? xInc * dy / dx : 0;
                        zInc = dx != 0 ? xInc * dz / dx : 0;
                    } else {
                        dd = dy;
                        yInc = dy > 0 ? 1 : -1;
                        xInc = dy != 0 ? yInc * dx / dy : 0;
                        zInc = dy != 0 ? yInc * dz / dy : 0;
                    }

                    let x = x0;
                    let y = y0;
                    let z = z0;

                    if (dd < 0) {
                        x = x1;
                        y = y1;
                        z = z1;
                        dd = -dd;
                        xInc = -xInc;
                        yInc = -yInc;
                        zInc = -zInc;
                    }

                    for (let k = 0; k < dd; k++) {
                        if (x >= 0 && x < xbound && y >= 0 && y < ybound) {
                            let pix = (~~y) * w + (~~x);
                            if (z > zbuf[pix]) {
                                zbuf[pix] = z;
                                cbuf[pix] = color;
                                sbuf[pix] = id;
                            }
                        }

                        x += xInc;
                        y += yInc;
                        z += zInc;
                    }

                    if (v1 == vStart) {
                        isClosed = true;
                    } else {
                        v0 = v1;

                        if (ibuf[j] != -1) {
                            v1 = ibuf[j++] * 3;
                        } else {
                            v1 = vStart;
                        }
                    }
                }

                j++;
            }
        }
    }

    /**
        Render the given mesh as solid object, using flat shading.
        @private
    */
    renderSolidFlat(mesh) {
        let w = this.frameWidth;
        let h = this.frameHeight;
        let ibuf = mesh.indexBuffer;
        let vbuf = mesh.transformedVertexBuffer;
        let nbuf = mesh.transformedFaceNormalZBuffer;
        let cbuf = this.colorBuffer;
        let zbuf = this.zBuffer;
        let sbuf = this.selectionBuffer;
        let numOfFaces = mesh.faceCount;
        let id = mesh.internalId;
        let material = mesh.material ? mesh.material : this.defaultMaterial;
        let palette = material.getPalette();
        let isOpaque = material.transparency == 0;
        let trans = ~~(material.transparency * 255);
        let opaci = 255 - trans;
        let drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if (material.transparency == 1) {
            return;
        }

        if (!nbuf || nbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            nbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, nbuf);

        let Xs = new Array(3);
        let Ys = new Array(3);
        let Zs = new Array(3);
        let i = 0, j = 0;
        while (i < numOfFaces) {
            let xformedNz = nbuf[i++];
            if (drawBothSides) {
                xformedNz = xformedNz > 0 ? xformedNz : -xformedNz;
            }
            if (xformedNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            } else {
                let color = 0xff000000 | palette[~~(xformedNz * 255)];

                let v0, v1, v2;
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

                    let high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    let low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    let mid = 3 - low - high;

                    if (high != low) {
                        let x0 = Xs[low];
                        let z0 = Zs[low];
                        let dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        let xStep0 = (Xs[low] - Xs[high]) / dy0;
                        let zStep0 = (Zs[low] - Zs[high]) / dy0;

                        let x1 = Xs[low];
                        let z1 = Zs[low];
                        let dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        let xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        let zStep1 = (Zs[low] - Zs[mid]) / dy1;

                        let x2 = Xs[mid];
                        let z2 = Zs[mid];
                        let dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        let xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        let zStep2 = (Zs[mid] - Zs[high]) / dy2;

                        let linebase = Ys[low] * w;
                        for (let y = Ys[low]; y > Ys[high]; y--) {
                            if (y >= 0 && y < h) {
                                let xLeft = ~~x0;
                                let zLeft = z0;
                                let xRight, zRight;
                                if (y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                } else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                }

                                if (xLeft > xRight) {
                                    let temp;
                                    temp = xLeft;
                                    xLeft = xRight;
                                    xRight = temp;
                                    temp = zLeft;
                                    zLeft = zRight;
                                    zRight = temp;
                                }

                                if (xLeft < 0) {
                                    xLeft = 0;
                                }
                                if (xRight >= w) {
                                    xRight = w - 1;
                                }

                                let zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                let pix = linebase + xLeft;
                                if (isOpaque) {
                                    for (let x = xLeft, z = zLeft; x <= xRight; x++, z += zInc) {
                                        if (z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            cbuf[pix] = color;
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                } else {
                                    for (let x = xLeft, z = zLeft; x < xRight; x++, z += zInc) {
                                        if (z > zbuf[pix]) {
                                            let foreColor = color;
                                            let backColor = cbuf[pix];
                                            let rr = ((backColor & 0xff0000) * trans + (foreColor & 0xff0000) * opaci) >> 8;
                                            let gg = ((backColor & 0xff00) * trans + (foreColor & 0xff00) * opaci) >> 8;
                                            let bb = ((backColor & 0xff) * trans + (foreColor & 0xff) * opaci) >> 8;
                                            let aa = (backColor & 0xff000000) | (opaci << 24);
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
                            if (y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                            } else {
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
    }

    /**
        Render the given mesh as solid object, using smooth shading.
        @private
    */
    renderSolidSmooth(mesh) {
        let w = this.frameWidth;
        let h = this.frameHeight;
        let ibuf = mesh.indexBuffer;
        let vbuf = mesh.transformedVertexBuffer;
        let vnbuf = mesh.transformedVertexNormalZBuffer;
        let vnibuf = mesh.vertexNormalIndexBuffer ? mesh.vertexNormalIndexBuffer : mesh.indexBuffer;
        let fnbuf = mesh.transformedFaceNormalZBuffer;
        let cbuf = this.colorBuffer;
        let zbuf = this.zBuffer;
        let sbuf = this.selectionBuffer;
        let numOfFaces = mesh.faceCount;
        let numOfVertices = vbuf.length / 3;
        let id = mesh.internalId;
        let material = mesh.material ? mesh.material : this.defaultMaterial;
        let palette = material.getPalette();
        let isOpaque = material.transparency == 0;
        let trans = ~~(material.transparency * 255);
        let opaci = 255 - trans;
        let drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if (material.transparency == 1) {
            return;
        }

        if (!vnbuf || vnbuf.length < mesh.vertexNormalBuffer.length / 3) {
            mesh.transformedVertexNormalZBuffer = new Array(mesh.vertexNormalBuffer.length / 3);
            vnbuf = mesh.transformedVertexNormalZBuffer;
        }

        if (!fnbuf || fnbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            fnbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.vertexNormalBuffer, vnbuf);
        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, fnbuf);

        let Xs = new Array(3);
        let Ys = new Array(3);
        let Zs = new Array(3);
        let Ns = new Array(3);
        let i = 0, j = 0;
        while (i < numOfFaces) {
            let xformedFNz = fnbuf[i++];
            if (drawBothSides) {
                xformedFNz = xformedFNz > 0 ? xformedFNz : -xformedFNz;
            }
            if (xformedFNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            } else {
                let i0, i1, i2;
                let v0, v1, v2;
                let ni0, ni1, ni2;
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
                    if (drawBothSides) {
                        if (Ns[0] < 0) {
                            Ns[0] = -Ns[0];
                        }
                        if (Ns[1] < 0) {
                            Ns[1] = -Ns[1];
                        }
                        if (Ns[2] < 0) {
                            Ns[2] = -Ns[2];
                        }
                    }

                    let high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    let low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    let mid = 3 - low - high;

                    if (high != low) {
                        let x0 = Xs[low];
                        let z0 = Zs[low];
                        let n0 = Ns[low] * 255;
                        let dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        let xStep0 = (Xs[low] - Xs[high]) / dy0;
                        let zStep0 = (Zs[low] - Zs[high]) / dy0;
                        let nStep0 = (Ns[low] - Ns[high]) * 255 / dy0;

                        let x1 = Xs[low];
                        let z1 = Zs[low];
                        let n1 = Ns[low] * 255;
                        let dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        let xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        let zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        let nStep1 = (Ns[low] - Ns[mid]) * 255 / dy1;

                        let x2 = Xs[mid];
                        let z2 = Zs[mid];
                        let n2 = Ns[mid] * 255;
                        let dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        let xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        let zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        let nStep2 = (Ns[mid] - Ns[high]) * 255 / dy2;

                        let linebase = Ys[low] * w;
                        for (let y = Ys[low]; y > Ys[high]; y--) {
                            if (y >= 0 && y < h) {
                                let xLeft = ~~x0;
                                let zLeft = z0;
                                let nLeft = n0;
                                let xRight, zRight, nRight;
                                if (y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    nRight = n1;
                                } else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    nRight = n2;
                                }

                                if (xLeft > xRight) {
                                    let temp;
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

                                let zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                let nInc = (xLeft != xRight) ? ((nRight - nLeft) / (xRight - xLeft)) : 1;
                                if (xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    nLeft -= xLeft * nInc;
                                    xLeft = 0;
                                }
                                if (xRight >= w) {
                                    xRight = w - 1;
                                }
                                let pix = linebase + xLeft;
                                if (isOpaque) {
                                    for (let x = xLeft, z = zLeft, n = nLeft; x <= xRight; x++, z += zInc, n += nInc) {
                                        if (z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            cbuf[pix] = 0xff000000 | palette[n > 0 ? (~~n) : 0];
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                } else {
                                    for (let x = xLeft, z = zLeft, n = nLeft; x < xRight; x++, z += zInc, n += nInc) {
                                        if (z > zbuf[pix]) {
                                            let foreColor = palette[n > 0 ? (~~n) : 0];
                                            let backColor = cbuf[pix];
                                            let rr = ((backColor & 0xff0000) * trans + (foreColor & 0xff0000) * opaci) >> 8;
                                            let gg = ((backColor & 0xff00) * trans + (foreColor & 0xff00) * opaci) >> 8;
                                            let bb = ((backColor & 0xff) * trans + (foreColor & 0xff) * opaci) >> 8;
                                            let aa = (backColor & 0xff000000) | (opaci << 24);
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
                            if (y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                n1 -= nStep1;
                            } else {
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
    }

    /**
        Render the given mesh as textured object, with no lightings.
        @private
    */
    renderSolidTexture(mesh) {
        let w = this.frameWidth;
        let h = this.frameHeight;
        let ibuf = mesh.indexBuffer;
        let vbuf = mesh.transformedVertexBuffer;
        let nbuf = mesh.transformedFaceNormalZBuffer;
        let cbuf = this.colorBuffer;
        let zbuf = this.zBuffer;
        let sbuf = this.selectionBuffer;
        let numOfFaces = mesh.faceCount;
        let id = mesh.internalId;
        let texture = mesh.texture;
        let isOpaque = !texture.hasTransparency;
        let tbuf = mesh.texCoordBuffer;
        let tibuf = mesh.texCoordIndexBuffer ? mesh.texCoordIndexBuffer : mesh.indexBuffer;
        let tdata = texture.data;
        let tdim = texture.width;
        let tbound = tdim - 1;
        let mipmaps = texture.hasMipmap() ? texture.mipmaps : null;
        let mipentries = mipmaps ? texture.mipentries : null;
        let drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        if (!nbuf || nbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            nbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, nbuf);

        let Xs = new Array(3);
        let Ys = new Array(3);
        let Zs = new Array(3);
        let THs = new Array(3);
        let TVs = new Array(3);
        let i = 0, j = 0;
        while (i < numOfFaces) {
            let xformedNz = nbuf[i++];
            if (drawBothSides) {
                xformedNz = xformedNz > 0 ? xformedNz : -xformedNz;
            }
            if (xformedNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            } else {
                let v0, v1, v2;
                let t0, t1, t2;
                v0 = ibuf[j] * 3;
                t0 = tibuf[j] * 2;
                j++;
                v1 = ibuf[j] * 3;
                t1 = tibuf[j] * 2;
                j++;

                // select an appropriate mip-map level for texturing
                //
                if (mipmaps) {
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

                    let faceArea = (Xs[1] - Xs[0]) * (Ys[2] - Ys[0]) - (Ys[1] - Ys[0]) * (Xs[2] - Xs[0]);
                    if (faceArea < 0) {
                        faceArea = -faceArea;
                    }
                    faceArea += 1;
                    let texArea = (THs[1] - THs[0]) * (TVs[2] - TVs[0]) - (TVs[1] -  TVs[0]) * (THs[2] - THs[0]);
                    if (texArea < 0) {
                        texArea = -texArea;
                    }
                    let mipRatio = texArea / faceArea;

                    let level = 0;
                    if (mipRatio < mipentries[1]) {
                        level = 0;
                    } else if (mipRatio >= mipentries[mipentries.length - 1]) {
                        level = mipentries.length - 1;
                        tdim = 1;
                    } else {
                        while (mipRatio >= mipentries[level + 1]) {
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

                    let high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    let low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    let mid = 3 - low - high;

                    if (high != low) {
                        let x0 = Xs[low];
                        let z0 = Zs[low];
                        let th0 = THs[low];
                        let tv0 = TVs[low];
                        let dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        let xStep0 = (Xs[low] - Xs[high]) / dy0;
                        let zStep0 = (Zs[low] - Zs[high]) / dy0;
                        let thStep0 = (THs[low] - THs[high]) / dy0;
                        let tvStep0 = (TVs[low] - TVs[high]) / dy0;

                        let x1 = Xs[low];
                        let z1 = Zs[low];
                        let th1 = THs[low];
                        let tv1 = TVs[low];
                        let dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        let xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        let zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        let thStep1 = (THs[low] - THs[mid]) / dy1;
                        let tvStep1 = (TVs[low] - TVs[mid]) / dy1;

                        let x2 = Xs[mid];
                        let z2 = Zs[mid];
                        let th2 = THs[mid];
                        let tv2 = TVs[mid];
                        let dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        let xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        let zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        let thStep2 = (THs[mid] - THs[high]) / dy2;
                        let tvStep2 = (TVs[mid] - TVs[high]) / dy2;

                        let linebase = Ys[low] * w;
                        for (let y = Ys[low]; y > Ys[high]; y--) {
                            if (y >= 0 && y < h) {
                                let xLeft = ~~x0;
                                let zLeft = z0;
                                let thLeft = th0;
                                let tvLeft = tv0;
                                let xRight, zRight, thRight, tvRight;
                                if (y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    thRight = th1;
                                    tvRight = tv1;
                                } else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    thRight = th2;
                                    tvRight = tv2;
                                }

                                if (xLeft > xRight) {
                                    let temp;
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

                                let zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                let thInc = (xLeft != xRight) ? ((thRight - thLeft) / (xRight - xLeft)) : 1;
                                let tvInc = (xLeft != xRight) ? ((tvRight - tvLeft) / (xRight - xLeft)) : 1;

                                if (xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    thLeft -= xLeft * thInc;
                                    tvLeft -= xLeft * tvInc;
                                    xLeft = 0;
                                }
                                if (xRight >= w) {
                                    xRight = w - 1;
                                }

                                let pix = linebase + xLeft;
                                if (isOpaque) {
                                    for (let x = xLeft, z = zLeft, th = thLeft, tv = tvLeft; x <= xRight; x++, z += zInc, th += thInc, tv += tvInc) {
                                        if (z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            cbuf[pix] = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                } else {
                                    for (let x = xLeft, z = zLeft, th = thLeft, tv = tvLeft; x < xRight; x++, z += zInc, th += thInc, tv += tvInc) {
                                        if (z > zbuf[pix]) {
                                            let foreColor = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            let backColor = cbuf[pix];
                                            let opaci = (foreColor >> 24) & 0xff;
                                            let trans = 255 - opaci;
                                            let rr = ((backColor & 0xff0000) * trans + (foreColor & 0xff0000) * opaci) >> 8;
                                            let gg = ((backColor & 0xff00) * trans + (foreColor & 0xff00) * opaci) >> 8;
                                            let bb = ((backColor & 0xff) * trans + (foreColor & 0xff) * opaci) >> 8;
                                            let aa = (backColor & 0xff000000) | (opaci << 24);
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
                            if (y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                th1 -= thStep1;
                                tv1 -= tvStep1;
                            } else {
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
    }

    /**
        Render the given mesh as textured object. Lighting will be calculated per face.
        @private
    */
    renderTextureFlat(mesh) {
        let w = this.frameWidth;
        let h = this.frameHeight;
        let ibuf = mesh.indexBuffer;
        let vbuf = mesh.transformedVertexBuffer;
        let nbuf = mesh.transformedFaceNormalZBuffer;
        let cbuf = this.colorBuffer;
        let zbuf = this.zBuffer;
        let sbuf = this.selectionBuffer;
        let numOfFaces = mesh.faceCount;
        let id = mesh.internalId;
        let material = mesh.material ? mesh.material : this.defaultMaterial;
        let palette = material.getPalette();
        let texture = mesh.texture;
        let isOpaque = (material.transparency == 0) && !texture.hasTransparency;
        let matOpacity = ~~((1 - material.transparency) * 255);
        let tbuf = mesh.texCoordBuffer;
        let tibuf = mesh.texCoordIndexBuffer ? mesh.texCoordIndexBuffer : mesh.indexBuffer;
        let tdata = texture.data;
        let tdim = texture.width;
        let tbound = tdim - 1;
        let mipmaps = texture.hasMipmap() ? texture.mipmaps : null;
        let mipentries = mipmaps ? texture.mipentries : null;
        let drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if (material.transparency == 1) {
            return;
        }

        if (!nbuf || nbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            nbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, nbuf);

        let Xs = new Array(3);
        let Ys = new Array(3);
        let Zs = new Array(3);
        let THs = new Array(3);
        let TVs = new Array(3);
        let i = 0, j = 0;
        while (i < numOfFaces) {
            let xformedNz = nbuf[i++];
            if (drawBothSides) {
                xformedNz = xformedNz > 0 ? xformedNz : -xformedNz;
            }
            if (xformedNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            } else {
                let color = 0xff000000 | palette[~~(xformedNz * 255)];

                let v0, v1, v2;
                let t0, t1, t2;
                v0 = ibuf[j] * 3;
                t0 = tibuf[j] * 2;
                j++;
                v1 = ibuf[j] * 3;
                t1 = tibuf[j] * 2;
                j++;

                if (mipmaps) {
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

                    let faceArea = (Xs[1] - Xs[0]) * (Ys[2] - Ys[0]) - (Ys[1] - Ys[0]) * (Xs[2] - Xs[0]);
                    if (faceArea < 0) {
                        faceArea = -faceArea;
                    }
                    faceArea += 1;
                    let texArea = (THs[1] - THs[0]) * (TVs[2] - TVs[0]) - (TVs[1] -  TVs[0]) * (THs[2] - THs[0]);
                    if (texArea < 0) {
                        texArea = -texArea;
                    }
                    let mipRatio = texArea / faceArea;

                    let level = 0;
                    if (mipRatio < mipentries[1]) {
                        level = 0;
                    } else if (mipRatio >= mipentries[mipentries.length - 1]) {
                        level = mipentries.length - 1;
                        tdim = 1;
                    } else {
                        while (mipRatio >= mipentries[level + 1]) {
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

                    let high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    let low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    let mid = 3 - low - high;

                    if (high != low) {
                        let x0 = Xs[low];
                        let z0 = Zs[low];
                        let th0 = THs[low];
                        let tv0 = TVs[low];
                        let dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        let xStep0 = (Xs[low] - Xs[high]) / dy0;
                        let zStep0 = (Zs[low] - Zs[high]) / dy0;
                        let thStep0 = (THs[low] - THs[high]) / dy0;
                        let tvStep0 = (TVs[low] - TVs[high]) / dy0;

                        let x1 = Xs[low];
                        let z1 = Zs[low];
                        let th1 = THs[low];
                        let tv1 = TVs[low];
                        let dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        let xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        let zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        let thStep1 = (THs[low] - THs[mid]) / dy1;
                        let tvStep1 = (TVs[low] - TVs[mid]) / dy1;

                        let x2 = Xs[mid];
                        let z2 = Zs[mid];
                        let th2 = THs[mid];
                        let tv2 = TVs[mid];
                        let dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        let xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        let zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        let thStep2 = (THs[mid] - THs[high]) / dy2;
                        let tvStep2 = (TVs[mid] - TVs[high]) / dy2;

                        let linebase = Ys[low] * w;
                        for (let y = Ys[low]; y > Ys[high]; y--) {
                            if (y >= 0 && y < h) {
                                let xLeft = ~~x0;
                                let zLeft = z0;
                                let thLeft = th0;
                                let tvLeft = tv0;
                                let xRight, zRight, thRight, tvRight;
                                if (y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    thRight = th1;
                                    tvRight = tv1;
                                } else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    thRight = th2;
                                    tvRight = tv2;
                                }

                                if (xLeft > xRight) {
                                    let temp;
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

                                let zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                let thInc = (xLeft != xRight) ? ((thRight - thLeft) / (xRight - xLeft)) : 1;
                                let tvInc = (xLeft != xRight) ? ((tvRight - tvLeft) / (xRight - xLeft)) : 1;

                                if (xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    thLeft -= xLeft * thInc;
                                    tvLeft -= xLeft * tvInc;
                                    xLeft = 0;
                                }
                                if (xRight >= w) {
                                    xRight = w - 1;
                                }

                                let pix = linebase + xLeft;
                                if (isOpaque) {
                                    for (let x = xLeft, z = zLeft, th = thLeft, tv = tvLeft; x <= xRight; x++, z += zInc, th += thInc, tv += tvInc) {
                                        if (z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            let texel = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            let rr = (((color & 0xff0000) >> 16) * ((texel & 0xff0000) >> 8));
                                            let gg = (((color & 0xff00) >> 8) * ((texel & 0xff00) >> 8));
                                            let bb = ((color & 0xff) * (texel & 0xff)) >> 8;
                                            cbuf[pix] = 0xff000000 | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                } else {
                                    for (let x = xLeft, z = zLeft, th = thLeft, tv = tvLeft; x < xRight; x++, z += zInc, th += thInc, tv += tvInc) {
                                        if (z > zbuf[pix]) {
                                            let foreColor = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            let backColor = cbuf[pix];
                                            let opaci = (((foreColor >> 24) & 0xff) * (matOpacity & 0xff)) >> 8;
                                            let rr = (((color & 0xff0000) >> 16) * ((foreColor & 0xff0000) >> 8));
                                            let gg = (((color & 0xff00) >> 8) * ((foreColor & 0xff00) >> 8));
                                            let bb = ((color & 0xff) * (foreColor & 0xff)) >> 8;
                                            let aa = (backColor & 0xff000000) | (opaci << 24);
                                            if (opaci > 250) {
                                                zbuf[pix] = z;
                                            } else {
                                                let trans = 255 - opaci;
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
                            if (y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                th1 -= thStep1;
                                tv1 -= tvStep1;
                            } else {
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
    }

    /**
        Render the given mesh as textured object. Lighting will be calculated per vertex and then interpolated between and inside scanlines.
        @private
    */
    renderTextureSmooth(mesh) {
        let w = this.frameWidth;
        let h = this.frameHeight;
        let ibuf = mesh.indexBuffer;
        let vbuf = mesh.transformedVertexBuffer;
        let vnbuf = mesh.transformedVertexNormalZBuffer;
        let vnibuf = mesh.vertexNormalIndexBuffer ? mesh.vertexNormalIndexBuffer : mesh.indexBuffer;
        let fnbuf = mesh.transformedFaceNormalZBuffer;
        let cbuf = this.colorBuffer;
        let zbuf = this.zBuffer;
        let sbuf = this.selectionBuffer;
        let numOfFaces = mesh.faceCount;
        let id = mesh.internalId;
        let numOfVertices = vbuf.length / 3;
        let material = mesh.material ? mesh.material : this.defaultMaterial;
        let palette = material.getPalette();
        let texture = mesh.texture;
        let isOpaque = (material.transparency == 0) && !texture.hasTransparency;
        let matOpacity = ~~((1 - material.transparency) * 255);
        let tbuf = mesh.texCoordBuffer;
        let tibuf = mesh.texCoordIndexBuffer ? mesh.texCoordIndexBuffer : mesh.indexBuffer;
        let tdata = texture.data;
        let tdim = texture.width;
        let tbound = tdim - 1;
        let mipmaps = texture.hasMipmap() ? texture.mipmaps : null;
        let mipentries = mipmaps ? texture.mipentries : null;
        let drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if (material.transparency == 1) {
            return;
        }

        if (!vnbuf || vnbuf.length < mesh.vertexNormalBuffer.length / 3) {
            mesh.transformedVertexNormalZBuffer = new Array(mesh.vertexNormalBuffer.length / 3);
            vnbuf = mesh.transformedVertexNormalZBuffer;
        }

        if (!fnbuf || fnbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            fnbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectorZs(this.rotMatrix, mesh.vertexNormalBuffer, vnbuf);
        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, fnbuf);

        let Xs = new Array(3);
        let Ys = new Array(3);
        let Zs = new Array(3);
        let Ns = new Array(3);
        let THs = new Array(3);
        let TVs = new Array(3);
        let i = 0, j = 0;
        while (i < numOfFaces) {
            let xformedFNz = fnbuf[i++];
            if (drawBothSides) {
                xformedFNz = xformedFNz > 0 ? xformedFNz : -xformedFNz;
            }
            if (xformedFNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            } else {
                let i0, i1, i2;
                let v0, v1, v2;
                let t0, t1, t2;
                let ni0, ni1, ni2;
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

                if (mipmaps) {
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

                    let faceArea = (Xs[1] - Xs[0]) * (Ys[2] - Ys[0]) - (Ys[1] - Ys[0]) * (Xs[2] - Xs[0]);
                    if (faceArea < 0) {
                        faceArea = -faceArea;
                    }
                    faceArea += 1;
                    let texArea = (THs[1] - THs[0]) * (TVs[2] - TVs[0]) - (TVs[1] -  TVs[0]) * (THs[2] - THs[0]);
                    if (texArea < 0) {
                        texArea = -texArea;
                    }
                    let mipRatio = texArea / faceArea;

                    let level = 0;
                    if (mipRatio < mipentries[1]) {
                        level = 0;
                    } else if (mipRatio >= mipentries[mipentries.length - 1]) {
                        level = mipentries.length - 1;
                        tdim = 1;
                    } else {
                        while (mipRatio >= mipentries[level + 1]) {
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
                    if (drawBothSides) {
                        if (Ns[0] < 0) {
                            Ns[0] = -Ns[0];
                        }
                        if (Ns[1] < 0) {
                            Ns[1] = -Ns[1];
                        }
                        if (Ns[2] < 0) {
                            Ns[2] = -Ns[2];
                        }
                    }

                    let high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    let low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    let mid = 3 - low - high;

                    if (high != low) {
                        let x0 = Xs[low];
                        let z0 = Zs[low];
                        let th0 = THs[low];
                        let tv0 = TVs[low];
                        let n0 = Ns[low] * 255;
                        let dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        let xStep0 = (Xs[low] - Xs[high]) / dy0;
                        let zStep0 = (Zs[low] - Zs[high]) / dy0;
                        let thStep0 = (THs[low] - THs[high]) / dy0;
                        let tvStep0 = (TVs[low] - TVs[high]) / dy0;
                        let nStep0 = (Ns[low] - Ns[high]) * 255 / dy0;

                        let x1 = Xs[low];
                        let z1 = Zs[low];
                        let th1 = THs[low];
                        let tv1 = TVs[low];
                        let n1 = Ns[low] * 255;
                        let dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        let xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        let zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        let thStep1 = (THs[low] - THs[mid]) / dy1;
                        let tvStep1 = (TVs[low] - TVs[mid]) / dy1;
                        let nStep1 = (Ns[low] - Ns[mid]) * 255 / dy1;

                        let x2 = Xs[mid];
                        let z2 = Zs[mid];
                        let th2 = THs[mid];
                        let tv2 = TVs[mid];
                        let n2 = Ns[mid] * 255;
                        let dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        let xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        let zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        let thStep2 = (THs[mid] - THs[high]) / dy2;
                        let tvStep2 = (TVs[mid] - TVs[high]) / dy2;
                        let nStep2 = (Ns[mid] - Ns[high]) * 255 / dy2;

                        let linebase = Ys[low] * w;
                        for (let y = Ys[low]; y > Ys[high]; y--) {
                            if (y >= 0 && y < h) {
                                let xLeft = ~~x0;
                                let zLeft = z0;
                                let thLeft = th0;
                                let tvLeft = tv0;
                                let nLeft = n0;
                                let xRight, zRight, thRight, tvRight, nRight;
                                if (y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    thRight = th1;
                                    tvRight = tv1;
                                    nRight = n1;
                                } else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    thRight = th2;
                                    tvRight = tv2;
                                    nRight = n2;
                                }

                                if (xLeft > xRight) {
                                    let temp;
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

                                let zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                let thInc = (xLeft != xRight) ? ((thRight - thLeft) / (xRight - xLeft)) : 1;
                                let tvInc = (xLeft != xRight) ? ((tvRight - tvLeft) / (xRight - xLeft)) : 1;
                                let nInc = (xLeft != xRight) ? ((nRight - nLeft) / (xRight - xLeft)) : 0;

                                if (xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    thLeft -= xLeft * thInc;
                                    tvLeft -= xLeft * tvInc;
                                    nLeft -= xLeft * nInc;
                                    xLeft = 0;
                                }
                                if (xRight >= w) {
                                    xRight = w - 1;
                                }

                                let pix = linebase + xLeft;
                                if (isOpaque) {
                                    for (let x = xLeft, z = zLeft, n = nLeft, th = thLeft, tv = tvLeft; x <= xRight; x++, z += zInc, n += nInc, th += thInc, tv += tvInc) {
                                        if (z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            let color = palette[n > 0 ? (~~n) : 0];
                                            let texel = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            let rr = (((color & 0xff0000) >> 16) * ((texel & 0xff0000) >> 8));
                                            let gg = (((color & 0xff00) >> 8) * ((texel & 0xff00) >> 8));
                                            let bb = ((color & 0xff) * (texel & 0xff)) >> 8;
                                            cbuf[pix] = 0xff000000 | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                } else {
                                    for (let x = xLeft, z = zLeft, n = nLeft, th = thLeft, tv = tvLeft; x < xRight; x++, z += zInc, n += nInc, th += thInc, tv += tvInc) {
                                        if (z > zbuf[pix]) {
                                            let color = palette[n > 0 ? (~~n) : 0];
                                            let foreColor = tdata[(tv & tbound) * tdim + (th & tbound)];
                                            let backColor = cbuf[pix];
                                            let opaci = (((foreColor >> 24) & 0xff) * (matOpacity & 0xff)) >> 8;
                                            let rr = (((color & 0xff0000) >> 16) * ((foreColor & 0xff0000) >> 8));
                                            let gg = (((color & 0xff00) >> 8) * ((foreColor & 0xff00) >> 8));
                                            let bb = ((color & 0xff) * (foreColor & 0xff)) >> 8;
                                            let aa = (backColor & 0xff000000) | (opaci << 24);
                                            if (opaci > 250) {
                                                zbuf[pix] = z;
                                            } else {
                                                let trans = 255 - opaci;
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
                            if (y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                th1 -= thStep1;
                                tv1 -= tvStep1;
                                n1 -= nStep1;
                            } else {
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
    }

    /**
        Render the given mesh as solid object with sphere mapping. Lighting will be calculated per vertex and then interpolated between and inside scanlines.
        @private
    */
    renderSolidSphereMapped(mesh) {
        let w = this.frameWidth;
        let h = this.frameHeight;
        let ibuf = mesh.indexBuffer;
        let vbuf = mesh.transformedVertexBuffer;
        let vnbuf = mesh.transformedVertexNormalBuffer;
        let vnibuf = mesh.vertexNormalIndexBuffer ? mesh.vertexNormalIndexBuffer : mesh.indexBuffer;
        let fnbuf = mesh.transformedFaceNormalZBuffer;
        let cbuf = this.colorBuffer;
        let zbuf = this.zBuffer;
        let sbuf = this.selectionBuffer;
        let numOfFaces = mesh.faceCount;
        let numOfVertices = vbuf.length / 3;
        let id = mesh.internalId;
        let material = mesh.material ? mesh.material : this.defaultMaterial;
        let palette = material.getPalette();
        let sphereMap = this.sphereMap;
        let sdata = sphereMap.data;
        let sdim = sphereMap.width;
        let sbound = sdim - 1;
        let isOpaque = material.transparency == 0;
        let trans = ~~(material.transparency * 255);
        let opaci = 255 - trans;
        let drawBothSides = mesh.isDoubleSided || this.isCullingDisabled;

        // skip this mesh if it is completely transparent
        if (material.transparency == 1) {
            return;
        }

        if (!vnbuf || vnbuf.length < mesh.vertexNormalBuffer.length) {
            mesh.transformedVertexNormalBuffer = new Array(mesh.vertexNormalBuffer.length);
            vnbuf = mesh.transformedVertexNormalBuffer;
        }

        if (!fnbuf || fnbuf.length < numOfFaces) {
            mesh.transformedFaceNormalZBuffer = new Array(numOfFaces);
            fnbuf = mesh.transformedFaceNormalZBuffer;
        }

        new Math3D().transformVectors(this.rotMatrix, mesh.vertexNormalBuffer, vnbuf);
        new Math3D().transformVectorZs(this.rotMatrix, mesh.faceNormalBuffer, fnbuf);

        let Xs = new Array(3);
        let Ys = new Array(3);
        let Zs = new Array(3);
        let NXs = new Array(3);
        let NYs = new Array(3);
        let NZs = new Array(3);
        let i = 0, j = 0;
        while (i < numOfFaces) {
            let xformedFNz = fnbuf[i++];
            if (drawBothSides) {
                xformedFNz = xformedFNz > 0 ? xformedFNz : -xformedFNz;
            }
            if (xformedFNz < 0) {
                do {
                } while (ibuf[j++] != -1);
            } else {
                let v0, v1, v2;
                let vn0, vn1, vn2;
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
                    if (drawBothSides) {
                        if (NZs[0] < 0) {
                            NZs[0] = -NZs[0];
                        }
                        if (NZs[1] < 0) {
                            NZs[1] = -NZs[1];
                        }
                        if (NZs[2] < 0) {
                            NZs[2] = -NZs[2];
                        }
                    }

                    let high = Ys[0] < Ys[1] ? 0 : 1;
                    high = Ys[high] < Ys[2] ? high : 2;
                    let low = Ys[0] > Ys[1] ? 0 : 1;
                    low = Ys[low] > Ys[2] ? low : 2;
                    let mid = 3 - low - high;

                    if (high != low) {
                        let x0 = Xs[low];
                        let z0 = Zs[low];
                        let n0 = NZs[low] * 255;
                        let sh0 = ((NXs[low] / 2 + 0.5) * sdim) & sbound;
                        let sv0 = ((0.5 - NYs[low] / 2) * sdim) & sbound;
                        let dy0 = Ys[low] - Ys[high];
                        dy0 = dy0 != 0 ? dy0 : 1;
                        let xStep0 = (Xs[low] - Xs[high]) / dy0;
                        let zStep0 = (Zs[low] - Zs[high]) / dy0;
                        let nStep0 = (NZs[low] - NZs[high]) * 255 / dy0;
                        let shStep0 = (((NXs[low] - NXs[high]) / 2) * sdim) / dy0;
                        let svStep0 = (((NYs[high] - NYs[low]) / 2) * sdim) / dy0;

                        let x1 = Xs[low];
                        let z1 = Zs[low];
                        let n1 = NZs[low] * 255;
                        let sh1 = ((NXs[low] / 2 + 0.5) * sdim) & sbound;
                        let sv1 = ((0.5 - NYs[low] / 2) * sdim) & sbound;
                        let dy1 = Ys[low] - Ys[mid];
                        dy1 = dy1 != 0 ? dy1 : 1;
                        let xStep1 = (Xs[low] - Xs[mid]) / dy1;
                        let zStep1 = (Zs[low] - Zs[mid]) / dy1;
                        let nStep1 = (NZs[low] - NZs[mid]) * 255 / dy1;
                        let shStep1 = (((NXs[low] - NXs[mid]) / 2) * sdim) / dy1;
                        let svStep1 = (((NYs[mid] - NYs[low]) / 2) * sdim) / dy1;

                        let x2 = Xs[mid];
                        let z2 = Zs[mid];
                        let n2 = NZs[mid] * 255;
                        let sh2 = ((NXs[mid] / 2 + 0.5) * sdim) & sbound;
                        let sv2 = ((0.5 - NYs[mid] / 2) * sdim) & sbound;
                        let dy2 = Ys[mid] - Ys[high];
                        dy2 = dy2 != 0 ? dy2 : 1;
                        let xStep2 = (Xs[mid] - Xs[high]) / dy2;
                        let zStep2 = (Zs[mid] - Zs[high]) / dy2;
                        let nStep2 = (NZs[mid] - NZs[high]) * 255 / dy2;
                        let shStep2 = (((NXs[mid] - NXs[high]) / 2) * sdim) / dy2;
                        let svStep2 = (((NYs[high] - NYs[mid]) / 2) * sdim) / dy2;

                        let linebase = Ys[low] * w;
                        for (let y = Ys[low]; y > Ys[high]; y--) {
                            if (y >= 0 && y < h) {
                                let xLeft = ~~x0;
                                let zLeft = z0;
                                let nLeft = n0;
                                let shLeft = sh0;
                                let svLeft = sv0;
                                let xRight, zRight, nRight, shRight, svRight;
                                if (y > Ys[mid]) {
                                    xRight = ~~x1;
                                    zRight = z1;
                                    nRight = n1;
                                    shRight = sh1;
                                    svRight = sv1;
                                } else {
                                    xRight = ~~x2;
                                    zRight = z2;
                                    nRight = n2;
                                    shRight = sh2;
                                    svRight = sv2;
                                }

                                if (xLeft > xRight) {
                                    let temp;
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

                                let zInc = (xLeft != xRight) ? ((zRight - zLeft) / (xRight - xLeft)) : 1;
                                let nInc = (xLeft != xRight) ? ((nRight - nLeft) / (xRight - xLeft)) : 1;
                                let shInc = (xLeft != xRight) ? ((shRight - shLeft) / (xRight - xLeft)) : 1;
                                let svInc = (xLeft != xRight) ? ((svRight - svLeft) / (xRight - xLeft)) : 1;
                                if (xLeft < 0) {
                                    zLeft -= xLeft * zInc;
                                    nLeft -= xLeft * nInc;
                                    shLeft -= shLeft * shInc;
                                    svLeft -= svLeft * svInc;
                                    xLeft = 0;
                                }
                                if (xRight >= w) {
                                    xRight = w - 1;
                                }
                                let pix = linebase + xLeft;
                                if (isOpaque) {
                                    for (let x = xLeft, z = zLeft, n = nLeft, sh = shLeft, sv = svLeft; x <= xRight; x++, z += zInc, n += nInc, sh += shInc, sv += svInc) {
                                        if (z > zbuf[pix]) {
                                            zbuf[pix] = z;
                                            let color = palette[n > 0 ? (~~n) : 0];
                                            let stexel = sdata[(sv & sbound) * sdim + (sh & sbound)];
                                            let rr = (((color & 0xff0000) >> 16) * ((stexel & 0xff0000) >> 8));
                                            let gg = (((color & 0xff00) >> 8) * ((stexel & 0xff00) >> 8));
                                            let bb = ((color & 0xff) * (stexel & 0xff)) >> 8;
                                            cbuf[pix] = 0xff000000 | (rr & 0xff0000) | (gg & 0xff00) | (bb & 0xff);
                                            sbuf[pix] = id;
                                        }
                                        pix++;
                                    }
                                } else {
                                    for (let x = xLeft, z = zLeft, n = nLeft, sh = shLeft, sv = svLeft; x < xRight; x++, z += zInc, n += nInc, sh += shInc, sv += svInc) {
                                        if (z > zbuf[pix]) {
                                            let color = palette[n > 0 ? (~~n) : 0];
                                            let foreColor = sdata[(sv & sbound) * sdim + (sh & sbound)];
                                            let backColor = cbuf[pix];
                                            let rr = (((color & 0xff0000) >> 16) * ((foreColor & 0xff0000) >> 8));
                                            let gg = (((color & 0xff00) >> 8) * ((foreColor & 0xff00) >> 8));
                                            let bb = ((color & 0xff) * (foreColor & 0xff)) >> 8;
                                            let aa = (backColor | color) & 0xff000000;
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
                            if (y > Ys[mid]) {
                                x1 -= xStep1;
                                z1 -= zStep1;
                                n1 -= nStep1;
                                sh1 -= shStep1;
                                sv1 -= svStep1;
                            } else {
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
