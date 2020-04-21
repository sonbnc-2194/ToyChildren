(function($){"use strict";function setSelectionRange(rangeStart,rangeEnd){if(this.createTextRange){var range=this.createTextRange();range.collapse(true);range.moveStart('character',rangeStart);range.moveEnd('character',rangeEnd-rangeStart);range.select();}else if(this.setSelectionRange){this.focus();this.setSelectionRange(rangeStart,rangeEnd);}}function getSelection(part){var pos=this.value.length;part=(part.toLowerCase()=='start'?'Start':'End');if(document.selection){var range=document.selection.createRange(),stored_range,selectionStart,selectionEnd;stored_range=range.duplicate();stored_range.expand('textedit');stored_range.setEndPoint('EndToEnd',range);selectionStart=stored_range.text.length-range.text.length;selectionEnd=selectionStart+range.text.length;return part=='Start'?selectionStart:selectionEnd;}else if(typeof(this['selection'+part])!="undefined"){pos=this['selection'+part];}return pos;}var _keydown={codes:{188:44,109:45,190:46,191:47,192:96,220:92,222:39,221:93,219:91,173:45,187:61,186:59,189:45,110:46},shifts:{96:"~",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",48:")",45:"_",61:"+",91:"{",93:"}",92:"|",59:":",39:"\"",44:"<",46:">",47:"?"}};$.fn.number=function(number,decimals,dec_point,thousands_sep){thousands_sep=(typeof thousands_sep==='undefined')?',':thousands_sep;dec_point=(typeof dec_point==='undefined')?'.':dec_point;decimals=(typeof decimals==='undefined')?0:decimals;var u_dec=('\\u'+('0000'+(dec_point.charCodeAt(0).toString(16))).slice(-4)),regex_dec_num=new RegExp('[^'+u_dec+'0-9]','g'),regex_dec=new RegExp(u_dec,'g');if(number===true){if(this.is('input:text')){return this.on({'keydown.format':function(e){var $this=$(this),data=$this.data('numFormat'),code=(e.keyCode?e.keyCode:e.which),chara='',start=getSelection.apply(this,['start']),end=getSelection.apply(this,['end']),val='',setPos=false;if(_keydown.codes.hasOwnProperty(code)){code=_keydown.codes[code];}if(!e.shiftKey&&(code>=65&&code<=90)){code+=32;}else if(!e.shiftKey&&(code>=69&&code<=105)){code-=48;}else if(e.shiftKey&&_keydown.shifts.hasOwnProperty(code)){chara=_keydown.shifts[code];}if(chara=='')chara=String.fromCharCode(code);if(code!==8&&chara!=dec_point&&!chara.match(/[0-9]/)){var key=(e.keyCode?e.keyCode:e.which);if(key==46||key==8||key==9||key==27||key==13||((key==65||key==82)&&(e.ctrlKey||e.metaKey)===true)||((key==86||key==67)&&(e.ctrlKey||e.metaKey)===true)||((key>=35&&key<=39))){return;}e.preventDefault();return false;}if(start==0&&end==this.value.length||$this.val()==0){if(code===8){start=end=1;this.value='';data.init=(decimals>0?-1:0);data.c=(decimals>0?-(decimals+1):0);setSelectionRange.apply(this,[0,0]);}else if(chara===dec_point){start=end=1;this.value='0'+dec_point+(new Array(decimals+1).join('0'));data.init=(decimals>0?1:0);data.c=(decimals>0?-(decimals+1):0);}else if(this.value.length===0){data.init=(decimals>0?-1:0);data.c=(decimals>0?-(decimals):0);}}else{data.c=end-this.value.length;}if(decimals>0&&chara==dec_point&&start==this.value.length-decimals-1){data.c++;data.init=Math.max(0,data.init);e.preventDefault();setPos=this.value.length+data.c;}else if(chara==dec_point){data.init=Math.max(0,data.init);e.preventDefault();}else if(decimals>0&&code==8&&start==this.value.length-decimals){e.preventDefault();data.c--;setPos=this.value.length+data.c;}else if(decimals>0&&code==8&&start>this.value.length-decimals){if(this.value==='')return;if(this.value.slice(start-1,start)!='0'){val=this.value.slice(0,start-1)+'0'+this.value.slice(start);$this.val(val.replace(regex_dec_num,'').replace(regex_dec,dec_point));}e.preventDefault();data.c--;setPos=this.value.length+data.c;}else if(code==8&&this.value.slice(start-1,start)==thousands_sep){e.preventDefault();data.c--;setPos=this.value.length+data.c;}else if(decimals>0&&start==end&&this.value.length>decimals+1&&start>this.value.length-decimals-1&&isFinite(+chara)&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&chara.length===1){if(end===this.value.length){val=this.value.slice(0,start-1);}else{val=this.value.slice(0,start)+this.value.slice(start+1);}this.value=val;setPos=start;}if(setPos!==false){setSelectionRange.apply(this,[setPos,setPos]);}$this.data('numFormat',data);},'keyup.format':function(e){var $this=$(this),data=$this.data('numFormat'),code=(e.keyCode?e.keyCode:e.which),start=getSelection.apply(this,['start']),setPos;if(this.value===''||(code<48||code>57)&&(code<96||code>105)&&code!==8)return;$this.val($this.val());if(decimals>0){if(data.init<1){start=this.value.length-decimals-(data.init<0?1:0);data.c=start-this.value.length;data.init=1;$this.data('numFormat',data);}else if(start>this.value.length-decimals&&code!=8){data.c++;$this.data('numFormat',data);}}setPos=this.value.length+data.c;setSelectionRange.apply(this,[setPos,setPos]);},'paste.format':function(e){var $this=$(this),original=e.originalEvent,val=null;if(window.clipboardData&&window.clipboardData.getData){val=window.clipboardData.getData('Text');}else if(original.clipboardData&&original.clipboardData.getData){val=original.clipboardData.getData('text/plain');}$this.val(val);e.preventDefault();return false;}}).each(function(){var $this=$(this).data('numFormat',{c:-(decimals+1),decimals:decimals,thousands_sep:thousands_sep,dec_point:dec_point,regex_dec_num:regex_dec_num,regex_dec:regex_dec,init:false});if(this.value==='')return;$this.val($this.val());});}else{return this.each(function(){var $this=$(this),num=+$this.text().replace(regex_dec_num,'').replace(regex_dec,'.');$this.number(!isFinite(num)?0:+num,decimals,dec_point,thousands_sep);});}}return this.text($.number.apply(window,arguments));};var origHookGet=null,origHookSet=null;if($.isPlainObject($.valHooks.text)){if($.isFunction($.valHooks.text.get))origHookGet=$.valHooks.text.get;if($.isFunction($.valHooks.text.set))origHookSet=$.valHooks.text.set;}else{$.valHooks.text={};}$.valHooks.text.get=function(el){var $this=$(el),num,data=$this.data('numFormat');if(!data){if($.isFunction(origHookGet)){return origHookGet(el);}else{return undefined;}}else{if(el.value==='')return'';num=+(el.value.replace(data.regex_dec_num,'').replace(data.regex_dec,'.'));return''+(isFinite(num)?num:0);}};$.valHooks.text.set=function(el,val){var $this=$(el),data=$this.data('numFormat');if(!data){if($.isFunction(origHookSet)){return origHookSet(el,val);}else{return undefined;}}else{return el.value=$.number(val,data.decimals,data.dec_point,data.thousands_sep);}};$.number=function(number,decimals,dec_point,thousands_sep){thousands_sep=(typeof thousands_sep==='undefined')?',':thousands_sep;dec_point=(typeof dec_point==='undefined')?'.':dec_point;decimals=!isFinite(+decimals)?0:Math.abs(decimals);var u_dec=('\\u'+('0000'+(dec_point.charCodeAt(0).toString(16))).slice(-4));var u_sep=('\\u'+('0000'+(thousands_sep.charCodeAt(0).toString(16))).slice(-4));number=(number+'').replace('\.',dec_point).replace(new RegExp(u_sep,'g'),'').replace(new RegExp(u_dec,'g'),'.').replace(new RegExp('[^0-9+\-Ee.]','g'),'');var n=!isFinite(+number)?0:+number,s='',toFixedFix=function(n,decimals){var k=Math.pow(10,decimals);return''+Math.round(n*k)/k;};s=(decimals?toFixedFix(n,decimals):''+Math.round(n)).split('.');if(s[0].length>3){s[0]=s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,thousands_sep);}if((s[1]||'').length<decimals){s[1]=s[1]||'';s[1]+=new Array(decimals-s[1].length+1).join('0');}return s.join(dec_point);}})(jQuery);