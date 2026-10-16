const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const html=fs.readFileSync(process.env.ESTIMATOR_HTML || require('node:path').join(__dirname,'..','index.html'),'utf8');
function load(){
 const elements={};
 for(const match of html.matchAll(/<(input|select|div|p|tbody|button)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){
  const [,tag,attrs,id]=match; let value=(attrs.match(/\bvalue="([^"]*)"/)||[])[1]||'';
  if(tag==='select'){const body=html.slice(match.index+match[0].length).split('</select>')[0],opts=[...body.matchAll(/<option value="([^"]+)"([^>]*)>/g)];value=(opts.find(o=>o[2].includes('selected'))||opts[0])[1];}
  elements[id]={get value(){return value},set value(v){value=String(v)},style:{display:id==='process-details'?'none':''},textContent:'',innerHTML:'',className:'',insertAdjacentHTML(_,s){this.innerHTML+=s}};
 }
 const context={alert(){},document:{addEventListener(){},getElementById:id=>elements[id],getElementsByClassName:()=>[]}};vm.createContext(context);
 for(const m of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],context);
 const set=values=>{for(const [id,value] of Object.entries(values))elements[id].value=value};
 return {context,elements,set};
}
test('Group to P2P keeps audio-only count within clamped total and propagates to results/details',()=>{
 const {context:c,elements:e,set}=load();set({'connections':10,'audio-only':10,'operation-mode':'group','upload':1}); c.updateBasedOnOperationMode('group');c.calculateResults();
 assert.match(e['network-analysis'].textContent,/115.2%/);
 set({'operation-mode':'p2p'});c.updateBasedOnOperationMode('p2p');c.calculateResults();c.generateProcessDetails();
 assert.equal(e.connections.value,'5');assert.equal(e['audio-only'].value,'5');
 assert.match(e['network-analysis'].textContent,/57.6%/);assert.match(e['process-table-body'].innerHTML,/Audio-Only Streams \(5\)/);
 assert.doesNotMatch(e['process-table-body'].innerHTML,/WebRTC Stream/);
});
for(const audio of [0,2,5])test(`P2P preserves ${audio} audio-only connections when within the new total`,()=>{
 const {context:c,elements:e,set}=load();set({connections:10,'audio-only':audio});c.updateBasedOnOperationMode('p2p');assert.equal(e.connections.value,'5');assert.equal(e['audio-only'].value,String(audio));
});
for(const mode of ['group','broadcast','meshcast'])test(`${mode} preserves valid audio-only and connection counts`,()=>{
 const {context:c,elements:e,set}=load();set({connections:10,'audio-only':8});c.updateBasedOnOperationMode(mode);assert.equal(e.connections.value,'10');assert.equal(e['audio-only'].value,'8');
});
test('P2P preserves a smaller valid total',()=>{const {context:c,elements:e,set}=load();set({connections:2,'audio-only':2});c.updateBasedOnOperationMode('p2p');assert.equal(e.connections.value,'2');assert.equal(e['audio-only'].value,'2')});
