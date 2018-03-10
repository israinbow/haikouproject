define(["require", "exports"], function (require, exports) {
"use strict";/*Compiled using Cheerp (R) by Leaning Technologies Ltd*/function PixiOverlay(){this.a0=null;this.a1=null;this.a2=null;this.a3=null;this.d4=-0;this.a5=null;this.a6=null;this.a7=null;this.a8=null;this.a9=null;this.a10=null;this.a11=null;this.a12=null;this.a13=null;this.a14=null;this.d15=-0;this.d16=-0;this.a17=null;this.a18=null;this.a19=null;this.a20=null;this.a21=null;this.a22=null;this.a23=null;this.d24=-0;this.i25=0;;this.d=[this];b0(this);}PixiOverlay.prototype.addTo=function (a0){return b2(this,a0);};PixiOverlay.prototype.clear=function (){return b1(this);};PixiOverlay.prototype.add=function (a0){return bZ(this,a0);};PixiOverlay.prototype.destroy=function (){return bY(this);};PixiOverlay.prototype.addMarker=function (a0,a1){return bX(this,a0,a1);};PixiOverlay.prototype.render=function (){return bW(this);};PixiOverlay.prototype.getWorldPoint=function (a0){return bV(this,a0);};PixiOverlay.prototype.getProjectPoint=function (a0,a1){return C(this,a0,a1);};PixiOverlay.prototype.initialize=function (a0,a1,a2){return bU(this,a0,a1,a2);};PixiOverlay.prototype.onAdd=function (a0){return bO(this,a0);};PixiOverlay.prototype._updateTransform=function (a0,a1){return aa(this,a0,a1);};PixiOverlay.prototype.onRemove=function (a0){return bf(this,a0);};PixiOverlay.prototype.resetPosition=function (){return ab(this);};PixiOverlay.prototype.scaleMarker=function (a0){return a3(this,a0);};PixiOverlay.prototype.getScale=function (a0,a1){return a4(this,a0,a1);};PixiOverlay.prototype.destinationPoint=function (a0,a1,a2){return aY(this,a0,a1,a2);};var aSlot=null;var oSlot=0;var nullArray=[null];var nullObj={d:nullArray,o:0};function b0(a){Object(a);a.a18="x";a.a19="y";a.a20="scale";a.a21="position";a.a22=new Array(0|0,0|0);a.a23=new Array(85.051128779806603,-180|0);a.d24=+Math.PI;return;}function b2(c,a){bO(c,a);return c;}function bO(n,m){var a=null,d=-0,c=null,k=-0,e=0,g=null;n.a10=m;a=m.getSize();a=a;d=+m.getZoom();n.d16=d;c=n.a18;c=a[c];d=+c.valueOf();c=n.a19;a=a[c];k=+a.valueOf();a=n.a11;c=n.a13;a=a.autoDetectRenderer((d|0)|0,(k|0)|0,c);n.a6=a;a=n.a11;a=a.newContainer();n.a7=a;a="any3d";d=+a.valueOf();a=n.a12;c="Browser";a=a[c];d=+a.valueOf();n.i25=((d!==0?1:0)?1:0)&255;a="zoomAnimation";d=+a.valueOf();a="options";a=m[a];d=+a.valueOf();if(d!==0){e=n.i25&255;e=((e&1)&255)!==0?1:0;}else{e=0;}a="plugins.interaction-layer leaflet-zoom-";c=j((e|0?bv:bu),(e|0?0|0:0|0)|0);a=a.concat(c);c=n.a6;g="view";c=c[g];n.a14=c;a=String(a);c.className=a;a="overlayPane";a=m.getPane(a);c=n.a14;a.appendChild(c);a=[{a0:null}];a[0].a0=null;c={a0:null,a1:{a0:null}};c.a0=bn;c.a1.a0=n;a[0].a0=c;a=cheerpCreateClosure(P,a[0|0]);n.a0=a;a="moveend";c=n.a0;m.addEventListener(a,c,null);a=[{a0:null}];a[0].a0=null;c={a0:null,a1:{a0:null}};c.a0=bp;c.a1.a0=n;a[0].a0=c;a=cheerpCreateClosure(T,a[0|0]);n.a1=a;a="resize";c=n.a1;m.addEventListener(a,c,null);a=[{a0:null}];a[0].a0=null;c={a0:null,a1:{a0:null}};c.a0=bq;c.a1.a0=n;a[0].a0=c;a=cheerpCreateClosure(P,a[0|0]);n.a3=a;a="zoom";c=n.a3;m.addEventListener(a,c,null);if(!(e|0)){ab(n);return;}a=[{a0:null}];a[0].a0=null;c={a0:null,a1:{a0:null}};c.a0=bs;c.a1.a0=n;a[0].a0=c;a=cheerpCreateClosure(T,a[0|0]);n.a2=a;a="zoomanim";c=n.a2;m.addEventListener(a,c,null);ab(n);return;}function b1(g){var a=null,d=-0,e=null,c=0;a=g.a9;do{if(!(a===null)){a="length";d=+a.valueOf();a=g.a9;e="children";a=a[e];d=+a.valueOf();c=d|0;if(!((c|0)>0)){break;}a=g.a9;a.removeChildren(0|0,c|0);}}while(0);a=g.a8;if(a===null){return;}a="length";d=+a.valueOf();a=g.a8;e="children";a=a[e];d=+a.valueOf();c=d|0;if(!((c|0)>0)){return;}a=g.a8;a.removeChildren(0|0,c|0);return;}function bZ(k,g){var a=null,c=null,d=-0,e=-0;a=k.a8;if(a===null){a=k.a11;a=a.newContainer();k.a8=a;c=k.a7;c.addChild(a);a=k.a10;c=k.a23;a=a.latLngToLayerPoint(c);c=k.a18;c=a[c];d=+c.valueOf();c=k.a19;a=a[c];e=+a.valueOf();a=k.a8;c=k.a21;a=a[c];a.set((+((d|0)|0)),(+((e|0)|0)));a=k.a8;c=k.a20;a=a[c];d=+(k.d4);a.set(d,d);a=k.a8;}a.addChild(g);return;}function bY(c){var a=null;a=c.a10;bf(c,a);return;}function bf(e,d){var a=null,c=null;a="overlayPane";a=d.getPane(a);c=e.a14;a.removeChild(c);a="moveend";c=e.a0;d.removeEventListener(a,c,null);a="resize";c=e.a1;d.removeEventListener(a,c,null);a="zoom";c=e.a3;d.removeEventListener(a,c,null);a=e.a2;if(!(a===null)){a="zoomanim";c=e.a2;d.removeEventListener(a,c,null);}a=e.a6;a.destroy();a=e.a9;if(!(a===null)){a.destroy();}a=e.a8;if(!(a===null)){a.destroy();}a=e.a11;c="utils";a=a[c];c="TextureCache";a[c];a=e.a11;c="utils";a=a[c];c="BaseTextureCache";a[c];return;}function bX(m,k,g){var a=null,c=null,e=-0,d=-0;a=m.a9;if(a===null){a=m.a11;a=a.newContainer();m.a9=a;c=m.a7;c.addChild(a);a=m.a10;c=m.a23;a=a.latLngToLayerPoint(c);c=m.a18;c=a[c];e=+c.valueOf();c=m.a19;a=a[c];d=+a.valueOf();a=m.a9;c=m.a21;a=a[c];a.set((+((e|0)|0)),(+((d|0)|0)));}a=m.a21;a=k[a];c=g[0|0];e=+c.valueOf();c=g[(0|0)+1|0];d=+c.valueOf();a.set(e,d);a=m.a9;a.addChild(k);return;}function bW(d){var c=null,a=null;c=d.a6;a=d.a7;c.render(a);return;}function bV(n,m){var d=-0,a=null,c=null,g=-0,k=-0,e=-0;d=+(n.d15);a=C(n,m,(d|0)|0);c=a[0|0];d=+c.valueOf();g=+(n.d4);c=a[(0|0)+1|0];k=+c.valueOf();e=+(n.d4);a.splice(0|0,2|0,(d/g),(k/e));return a;}function C(e,d,c){var a=null,g=null,k=null;a=e.a10;a=a.project(d,(+(c|0)));a=a;g=e.a18;g=a[g];k=e.a19;a=a[k];return new Array(g,a);}function bU(g,e,d,c){var a=null;PIXI.newContainer=function(){ return new PIXI.Container();};g.a11=d;g.a12=e;g.a13=c;a="DomUtil";a=e[a];g.a5=a;if(c===null){return;}e.setOptions(g,c);return;}function ab(p){var a=null,c=-0,e=null,d=null,m=0,k=0,g=-0,n=-0;a=p.a10;c=+a.getZoom();p.d15=c;a=p.a10;e=p.a22;e=a.containerPointToLayerPoint(e);a=p.a5;d=p.a14;a.setPosition(d,e);a=p.a22;c=+(p.d15);c=a4(p,a,(c|0)|0);p.d4=c;a=p.a10;d=p.a23;a=a.latLngToLayerPoint(d);d=p.a18;d=a[d];c=+d.valueOf();m=c|0;d=p.a19;a=a[d];c=+a.valueOf();k=c|0;a=p.a8;if(!(a===null)){d=p.a21;a=a[d];a.set((+(m|0)),(+(k|0)));a=p.a8;d=p.a20;a=a[d];c=+(p.d4);a.set(c,c);}a=p.a9;if(!(a===null)){c=+(p.d15);g=+(p.d16);c=c-g;if(c!==0){g=a3(p,(c|0)|0);a=p.a9;d=p.a20;a=a[d];d=p.a18;d=a[d];n=+d.valueOf();if(c>0){c=g*n;}else{c=n/g;}a.set(c,c);a=p.a9;}d=p.a21;a=a[d];a.set((+(m|0)),(+(k|0)));}a=p.a7;d=p.a18;d=e[d];c=+d.valueOf();d=p.a19;e=e[d];g=+e.valueOf();a.setTransform((-0-c),(-0-g));c=+(p.d15);p.d16=c;a=p.a10;a=a.getCenter();p.a17=a;return;}function aa(n,m,k){var c=null,g=-0,a=null,d=null,e=null,p=0;c=n.a10;g=+(n.d16);g=+c.getZoomScale(k,g);c=n.a5;a=n.a14;c=c.getPosition(a);a=n.a10;a=a.getSize();a=a.multiplyBy(0.5);d=n.a10;e=n.a17;d=d.project(e,k);e=n.a10;e=e.project(m,k);d=e.subtract(d);e=a.multiplyBy((-0-g));c=e.add(c);c=c.add(a);c=c.subtract(d);p=n.i25&255;a=n.a5;d=n.a14;if(((p&1)&255)===0){a.setPosition(d,c);return;}else{a.setTransform(d,c,g);return;}}function a4(m,k,g){var c=null,a=null,e=-0,d=-0;c=C(m,k,g|0);a=aY(m,k,90,0.5);a=C(m,a,g|0);a=a[0|0];e=+a.valueOf();c=c[0|0];d=+c.valueOf();return (e-d)/500;}function a3(r,q){var d=-0,g=null,c=null,n=0,p=0,e=0,m=null,k=null,a=-0;if((q|0)===0){d=1;return d;}d=+Math.abs((+(q|0)));d=+Math.pow(2,d);g=r.a9;c="children";g=g[c];g=g;n=g.length;if(!((n|0)>0)){return d;}p=(q|0)>0?1:0;e=0;while(1){c=g[(0|0)+e|0];m=r.a20;c=c[m];m=c;k=r.a18;k=c[k];a=+k.valueOf();k=r.a19;c=c[k];+c.valueOf();if(p|0){a=a/d;m.set(a,a);}else{a=d*a;m.set(a,a);}e=e+1|0;if(!((e|0)<(n|0))){break;}}return d;}function aY(aj,ah,r,q){var c=-0,a=-0,k=null,d=-0,g=-0,p=-0,n=-0,m=-0,e=-0,ai=-0;c=q/6371;a=+(aj.d24);a=(a/180)*r;k=ah[0|0];d=+k.valueOf();g=+(aj.d24);d=(d*g)/180;k=ah[(0|0)+1|0];g=+k.valueOf();p=+(aj.d24);n=+Math.sin(d);m=+Math.sin(c);c=+Math.cos(c);d=+Math.cos(d);e=+Math.cos(a);e=+Math.asin((n*c+(m*d)*e));a=+Math.sin(a);ai=+Math.sin(e);c=+Math.atan2((d*(m*a)),(c-(n*ai)));a=+(aj.d24);c=((((g*p)/180+c)+a*3)%(a*2));a=+(aj.d24);return new Array(((e*180)/a),(((c-a)*180)/a));}function bT(){return 0|0;}function T(g,e){var a=null,c=null,d=null;a=g.a0;c=aSlot=[null];c[0|0]=e;d=a.a0;d=d.a6;d(a,c,0|0);if(g===null){return;}a=g.a0;if(a===null){return;}c=a.a0;c=c.a5;c(a);return;}function aV(a){return;}function aU(a){return;}function aT(c){var a=null;a={a0:null,a1:{a0:null}};a.a0=bs;a.a1.a0=c.a1.a0;return a;}function aS(a){return;}function aR(a){return;}function aQ(g,e,f){var d=null,a=null,c=null,m=null,k=-0;d=g.a1.a0;a=e[f|0];c="center";c=a[c];m="zoom";a=a[m];k=+a.valueOf();aa(d,c,k);return;}function P(d){var a=null,c=null;a=d.a0;c=a.a0;c=c.a6;c(a);if(d===null){return;}a=d.a0;if(a===null){return;}c=a.a0;c=c.a5;c(a);return;}function aP(a){return;}function aO(a){return;}function aN(c){var a=null;a={a0:null,a1:{a0:null}};a.a0=bq;a.a1.a0=c.a1.a0;return a;}function aM(a){return;}function aL(a){return;}function aK(g){var c=null,a=null,e=null,d=-0;c=g.a1.a0;a=c.a10;a=a.getCenter();e=c.a10;d=+e.getZoom();aa(c,a,d);return;}function aJ(a){return;}function aI(a){return;}function aH(c){var a=null;a={a0:null,a1:{a0:null}};a.a0=bp;a.a1.a0=c.a1.a0;return a;}function aG(a){return;}function aF(a){return;}function aE(p,n,o){var d=null,c=null,m=null,a=null,k=null,g=-0,e=-0;d=p.a1.a0;c=n[o|0];m=d.a6;a="newSize";a=c[a];k=d.a18;a=a[k];g=+a.valueOf();a="newSize";c=c[a];a=d.a19;c=c[a];e=+c.valueOf();m.resize(g,e);c=d.a6;d=d.a7;c.render(d);return;}function aC(a){return;}function aB(a){return;}function aA(c){var a=null;a={a0:null,a1:{a0:null}};a.a0=bn;a.a1.a0=c.a1.a0;return a;}function az(a){return;}function ay(a){return;}function ax(d){var a=null,c=null;a=d.a1.a0;ab(a);c=a.a6;a=a.a7;c.render(a);return;}function aw(g,h){var a=null,c=0,d=0,e=null;a=String();c=g[h|0]&255;if((c&255)===0){return a;}d=0;while(1){e=String.fromCharCode((c<<24>>24)|0);a=a.concat(e);d=d+1|0;c=g[(h|0)+d|0]&255;if((c&255)===0){break;}}return a;}function j(a,b){var c=null;c=aw(a,b|0);return String(c);}function an(aj,ai){var label=0,ah=null,q=0,n=0,m=0,e=0,r=0,k=0,g=0,p=-0,c=0,a=0,d=0,bR=0;ah=aSlot={d:new DataView(new ArrayBuffer(8)),o:0};ah.d.setFloat64(0*8+0*8+ah.o|0,aj,true);q=ah.d.getInt32(1*4+0*8+0*8+ah.o|0,true)|0;n=ah.d.getInt32(0*8+0*8+ah.o|0,true)|0;ah.d.setFloat64(0*8+0*8+ah.o|0,ai,true);m=ah.d.getInt32(1*4+0*8+0*8+ah.o|0,true)|0;e=ah.d.getInt32(0*8+0*8+ah.o|0,true)|0;r=q&-2147483648;k=r^q;g=m&2147483647;do{if(!((k|0)>2146435071||((g|e)|0)===0)){if(((e|0-e|0)>>>31|g)>>>0>2146435072){break;}do{if(!((k|0)>(g|0))){if((k|0)<(g|0)||n>>>0<e>>>0){p=aj;return p;}if(!((n|0)===(e|0))){break;}p=+(G[(q>>>31)|0]);return p;}}while(0);do{if((k|0)<1048576){if((q|0)===(r|0)){if(!((n|0)>0)){c=-1043;break;}a=n;c=-1043;while(1){c=c+-1|0;a=a<<1;if(!((a|0)>0)){break;}}break;}else{a=q<<11;if(!((a|0)>0)){c=-1022;break;}c=-1022;while(1){c=c+-1|0;a=a<<1;if(!((a|0)>0)){break;}}break;}}else{c=(k>>20)+-1023|0;}}while(0);do{if(g>>>0<1048576){if((g|0)===0){if(!((e|0)>0)){a=-1043;break;}d=e;a=-1043;while(1){a=a+-1|0;d=d<<1;if(!((d|0)>0)){break;}}break;}else{d=m<<11;if(!((d|0)>0)){a=-1022;break;}a=-1022;while(1){a=a+-1|0;d=d<<1;if(!((d|0)>0)){break;}}break;}}else{a=(g>>>20)+-1023|0;}}while(0);do{if((c|0)>-1023){k=q&1048575|1048576;d=n;}else{d=-1022-c|0;if((d|0)<32){k=n>>>(32-d|0)|k<<d;d=n<<d;break;}else{k=n<<(d+-32|0);d=0;break;}}}while(0);do{if((a|0)>-1023){n=m&1048575|1048576;}else{m=-1022-a|0;if((m|0)<32){n=e>>>(32-m|0)|g<<m;e=e<<m;break;}else{n=e<<(m+-32|0);e=0;break;}}}while(0);m=d-e|0;g=(k-n|0)+(((d>>>0<e>>>0)?1:0)<<31>>31)|0;do{if((c|0)===(a|0)){e=d;d=m;c=g;}else{c=c-a|0;bR=c;c=g;g=d;d=m;m=k;k=bR;while(1){k=k+-1|0;if((c|0)<0){m=(g>>>31)+(m<<1)|0;}else{if(((d|c)|0)===0){break;}m=(d>>>31)+(c<<1)|0;g=d;}g=g<<1;d=g-e|0;c=(((g>>>0<e>>>0)?1:0)<<31>>31)+(m-n|0)|0;if((k|0)===0){e=g;k=m;label=47;break;}}if(label===47){break;}p=+(G[(q>>>31)|0]);return p;}}while(0);d=(c|0)>-1?d:e;c=(c|0)>-1?c:k;if(((d|c)|0)===0){p=+(G[(q>>>31)|0]);return p;}if((c|0)<1048576){while(1){c=(d>>>31)+(c<<1)|0;d=d<<1;a=a+-1|0;if(!((c|0)<1048576)){break;}}}if((a|0)>-1023){ah.d.setInt32(1*4+0*8+0*8+ah.o|0,(((c+-1048576|0)|r)|((a<<20)+1072693248|0)),true);ah.d.setInt32(0*8+0*8+ah.o|0,d,true);p=+(ah.d.getFloat64(0*8+0*8+ah.o|0,true));return p;}a=-1022-a|0;do{if((a|0)<21){d=c<<(32-a|0)|d>>>a;a=c>>a;c=d;}else{if((a|0)<32){c=c<<(32-a|0)|d>>>a;a=r;break;}else{c=c>>(a+-32|0);a=r;break;}}}while(0);ah.d.setInt32(1*4+0*8+0*8+ah.o|0,(a|r),true);ah.d.setInt32(0*8+0*8+ah.o|0,c,true);p=+(ah.d.getFloat64(0*8+0*8+ah.o|0,true));return p;}}while(0);p=aj*ai;p=p/p;return p;}function am(g,e){var label=0,d=-0,k=null,a=0,c=0;d=an(g,e);k=aSlot={d:new DataView(new ArrayBuffer(8)),o:0};k.d.setFloat64(0*8+0*8+k.o|0,e,true);a=k.d.getInt32(1*4+0*8+0*8+k.o|0,true)|0;c=k.d.getInt32(0*8+0*8+k.o|0,true)|0;do{if(((c|a)|0)===0||(a|0)===-2147483648&&(c|0)===0){label=3;}else{if(a>>>0<1048576||((a&2147483647)+-1048576|0)>>>0<2145386496){label=3;break;}if((a|0)<0&&a>>>0<2148532224||(a|0)===2146435072&&(c|0)===0){label=3;break;}if((a|0)===-1048576&&(c|0)===0){break;}return d;}}while(0);if(label===3){}k.d.setFloat64(0*8+0*8+k.o|0,g,true);a=k.d.getInt32(1*4+0*8+0*8+k.o|0,true)|0;c=k.d.getInt32(0*8+0*8+k.o|0,true)|0;do{if(((c|a)|0)===0||(a|0)===-2147483648&&(c|0)===0){a=2;label=11;}else{if(((a&2147483647)+-1048576|0)>>>0<2145386496){a=4;label=11;break;}if(a>>>0<1048576){a=3;label=11;break;}if((a|0)<0&&a>>>0<2148532224){a=3;label=11;break;}if((a|0)===2146435072&&(c|0)===0){a=1;label=11;break;}a=((a|0)===-1048576&&(c|0)===0?1:0)?1:0;break;}}while(0);if(label===11){}if(!(e===0&&(a|0)!==0)){return d;}s.i0=33;d=NaN;return d;}var bQ=new construct_struct$p_Z7__sFILE();var bP=new construct_struct$p_Z7__sFILE();var bN=new construct_struct$p_Z7__sFILE();var bM=new Uint8Array([67,0]);var s={i0:0,a1:bQ,a2:bP,a3:bN,i4:0,a5:null,i6:0,i7:0,a8:bM[0|0],a9:null,a10:null,i11:0,i12:0,a13:null,a14:null,a15:null,a16:null,a17:null,a18:null,a19:{a0:null,i1:0,a2:createPointerArray([],0,32,null),a3:null},a20:{a0:null,i1:0,a2:null},a21:null,a22:null,a23:null};var G=new Float64Array([0,-0]);var bK=new Uint8Array([99,104,105,108,100,114,101,110,0]);var bJ=new Uint8Array([111,118,101,114,108,97,121,80,97,110,101,0]);var bL=new Uint8Array([109,111,118,101,101,110,100,0]);var bG=new Uint8Array([114,101,115,105,122,101,0]);var bF=new Uint8Array([122,111,111,109,0]);var bE=new Uint8Array([122,111,111,109,97,110,105,109,0]);var bD=new Uint8Array([117,116,105,108,115,0]);var bC=new Uint8Array([84,101,120,116,117,114,101,67,97,99,104,101,0]);var bB=new Uint8Array([66,97,115,101,84,101,120,116,117,114,101,67,97,99,104,101,0]);var bA=new Uint8Array([97,110,121,51,100,0]);var bz=new Uint8Array([66,114,111,119,115,101,114,0]);var by=new Uint8Array([122,111,111,109,65,110,105,109,97,116,105,111,110,0]);var bx=new Uint8Array([111,112,116,105,111,110,115,0]);var bw=new Uint8Array([112,108,117,103,105,110,115,46,105,110,116,101,114,97,99,116,105,111,110,45,108,97,121,101,114,32,108,101,97,102,108,101,116,45,122,111,111,109,45,0]);var bv=new Uint8Array([97,110,105,109,97,116,101,100,0]);var bu=new Uint8Array([104,105,100,101,0]);var bt=new Uint8Array([118,105,101,119,0]);var bn={a0:null,a1:aC,a2:aB,a3:aA,a4:az,a5:ay,a6:ax};var bp={a0:null,a1:aJ,a2:aI,a3:aH,a4:aG,a5:aF,a6:aE};var bq={a0:null,a1:aP,a2:aO,a3:aN,a4:aM,a5:aL,a6:aK};var bs={a0:null,a1:aV,a2:aU,a3:aT,a4:aS,a5:aR,a6:aQ};var br=new Uint8Array([99,101,110,116,101,114,0]);var bo=new Uint8Array([110,101,119,83,105,122,101,0]);var bm=new Uint8Array([68,111,109,85,116,105,108,0]);var bl=new Uint8Array([108,101,110,103,116,104,0]);var bk=new Uint8Array([120,0]);var bj=new Uint8Array([121,0]);var bi=new Uint8Array([115,99,97,108,101,0]);var bh=new Uint8Array([112,111,115,105,116,105,111,110,0]);function construct_class$p_Z11PixiOverlay(){this.a0=null;this.a1=null;this.a2=null;this.a3=null;this.d4=-0;this.a5=null;this.a6=null;this.a7=null;this.a8=null;this.a9=null;this.a10=null;this.a11=null;this.a12=null;this.a13=null;this.a14=null;this.d15=-0;this.d16=-0;this.a17=null;this.a18=null;this.a19=null;this.a20=null;this.a21=null;this.a22=null;this.a23=null;this.d24=-0;this.i25=0;}function construct_struct$p_Z7__sFILE(){this.a0=null;this.i1=0;this.i2=0;this.i3=0;this.a4={a0:null,i1:0};this.i5=0;this.a6=null;this.a7=null;this.a8=null;this.a9=null;this.a10=null;this.a11=null;this.a12={a0:null,i1:0};this.a13=null;this.i14=0;this.a15=new Uint8Array(4);this.a16={a0:null,i1:0};this.i17=0;this.i18=0;this.i19=0;this.a20={i0:0,i1:0};this.i21=0;}function construct_struct$p_Z6_reent(){this.i0=0;this.a1=null;this.a2=null;this.a3=null;this.i4=0;this.a5=null;this.i6=0;this.i7=0;this.a8=null;this.a9=null;this.a10=null;this.i11=0;this.i12=0;this.a13=null;this.a14=null;this.a15=null;this.a16=null;this.a17=null;this.a18=null;this.a19={a0:null,i1:0,a2:createPointerArray([],0,32,null),a3:null};this.a20={a0:null,i1:0,a2:null};this.a21=null;this.a22=null;this.a23=null;}function createPointerArray(ret,start,end,elem){for(var __i__=start;__i__<end;__i__++)ret[__i__]=elem;return ret;}function cheerpCreateClosure(func, obj){return function(e){func(obj,e);};}bT();
    exports.PixiOverlay = PixiOverlay;
});