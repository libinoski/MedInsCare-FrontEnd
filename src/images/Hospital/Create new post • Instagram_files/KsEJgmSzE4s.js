;/*FB_PKG_DELIM*/

__d("usePolarisMediaOverlayInfo_media.graphql",[],(function(a,b,c,d,e,f){"use strict";a={argumentDefinitions:[],kind:"Fragment",metadata:null,name:"usePolarisMediaOverlayInfo_media",selections:[{alias:null,args:null,concreteType:"XDTMediaOverlayPayloadSchema",kind:"LinkedField",name:"media_overlay_info",plural:!1,selections:[{alias:null,args:null,kind:"ScalarField",name:"description",storageKey:null},{alias:null,args:null,kind:"ScalarField",name:"misinformation_type",storageKey:null},{alias:null,args:null,kind:"ScalarField",name:"overlay_layout",storageKey:null},{alias:null,args:null,kind:"ScalarField",name:"overlay_type",storageKey:null},{alias:null,args:null,kind:"ScalarField",name:"title",storageKey:null}],storageKey:null}],type:"XDTMediaDict",abstractKey:null};e.exports=a}),null);
__d("usePolarisMediaOverlayInfo",["CometRelay","polarisMisinformationTypeUtils","react","usePolarisMediaOverlayInfo_media.graphql"],(function(a,b,c,d,e,f,g){"use strict";var h,i,j=(i||d("react")).unstable_useMemoCache;function a(a){var c=j(4);a=d("CometRelay").useFragment(h!==void 0?h:h=b("usePolarisMediaOverlayInfo_media.graphql"),a);var e;c[0]!==a?(e=a==null?void 0:a.media_overlay_info,c[0]=a,c[1]=e):e=c[1];a=e;if(c[2]!==a){e=a!=null?{banner:null,bloks_data:null,buttons:null,description:a.description,icon:null,misinformation_type:d("polarisMisinformationTypeUtils").getMisinformationType(a.misinformation_type),overlay_layout:(e=a.overlay_layout)!=null?e:0,overlay_type:(e=(e=a.overlay_type)==null?void 0:e.toString())!=null?e:"",title:a.title}:null;c[2]=a;c[3]=e}else e=c[3];return e}g["default"]=a}),98);
__d("XPolarisClipsTabControllerRouteBuilder",["jsRouteBuilder"],(function(a,b,c,d,e,f,g){a=c("jsRouteBuilder")("/reels/{?shortcode}/",Object.freeze({launch_app_store:!1}),void 0);b=a;g["default"]=b}),98);