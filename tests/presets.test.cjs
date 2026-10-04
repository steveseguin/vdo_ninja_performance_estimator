const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path'),test=require('node:test');
const html=fs.readFileSync(process.env.ESTIMATOR_HTML || path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function boot(){const els={};for(const m of html.matchAll(/<(input|select)\b([^>]*\bid="([^"]+)"[^>]*)>([\s\S]*?)(?=<\/select>|<\/div>)/g)){const [,tag,attrs,id,contents]=m;let value=attrs.match(/value="([^"]*)"/)?.[1];if(tag==='select'){const opts=[...contents.matchAll(/<option\s+value="([^"]+)"([^>]*)>/g)];value=(opts.find(x=>x[2].includes('selected'))||opts[0])?.[1];}els[id]={value:String(value||''),max:attrs.match(/max="([^"]+)"/)?.[1],style:{},addEventListener(){}};}const get=id=>els[id]||(els[id]={value:'',style:{display:'none'},textContent:'',innerHTML:'',insertAdjacentHTML(_,v){this.innerHTML+=v}});const ctx=vm.createContext({document:{addEventListener(){},getElementById:get,getElementsByClassName(){return []}},alert(){}});vm.runInContext(script,ctx);return {ctx,els,get};}
const cases = {
 'basic-streaming': ['broadcast','720','30','2500','h264','5','0','medium','desktop-mid','50'],
 'gaming-broadcast': ['meshcast','1080','60','6000','h264','10','0','high','desktop-high','100'],
 'group-call': ['group','720','30','2000','vp8','8','2','medium','desktop-mid','20'],
 'low-resource': ['meshcast','480','30','1500','h264','3','1','low','laptop-mid','100'],
 'high-quality': ['meshcast','1080','60','6000','h264','15','0','high','desktop-premium-16','100']
};
const fields=['operation-mode','resolution','framerate','bitrate','codec','connections','audio-only','scene-complexity','cpu'];
for (const [name, expected] of Object.entries(cases)) {
 test(name+' retains explicit preset values and dependent limit',()=>{
  const {ctx,get}=boot();ctx.applyPreset(name);
  assert.deepEqual(fields.map(id=>String(get(id).value)),expected.slice(0,9));
  assert.equal(String(get('connections').max),expected[9]);
  ctx.calculateResults();assert.ok(!get('cpu-analysis').textContent.includes('NaN'));
 });
}
for(const mode of ['p2p','group','broadcast','meshcast']) {
 test('manual '+mode+' mode change still applies its defaults',()=>{
  const {ctx,get}=boot();get('connections').value='9';ctx.updateBasedOnOperationMode(mode);
  const expected={p2p:['2500','10'],group:['550','20'],broadcast:['1200','50'],meshcast:['2500','100']}[mode];
  assert.equal(String(get('bitrate').value),expected[0]);assert.equal(String(get('connections').max),expected[1]);
  if(mode==='p2p')assert.equal(String(get('connections').value),'5');
  if(mode==='group'){assert.equal(get('resolution').value,'480');assert.equal(get('framerate').value,'60');}
  if(mode==='broadcast'){assert.equal(get('resolution').value,'720');assert.equal(get('framerate').value,'60');}
  if(mode==='meshcast'){assert.equal(get('resolution').value,'1080');assert.equal(get('framerate').value,'60');assert.equal(get('codec').value,'h264');}
 });
}
test('low-resource preset reaches calculator at 480p30',()=>{
 const {ctx,get}=boot();ctx.applyPreset('low-resource');ctx.calculateResults();
 assert.match(get('cpu-analysis').textContent,/48\.7%/);assert.match(get('cpu-analysis').textContent,/plenty of headroom/);
});
test('sequential presets do not leak previous mode defaults',()=>{
 const {ctx,get}=boot();for(const name of ['high-quality','group-call','low-resource','basic-streaming','gaming-broadcast']){
  ctx.applyPreset(name);assert.deepEqual(fields.map(id=>String(get(id).value)),cases[name].slice(0,9));
 }
});
test('unknown preset leaves form unchanged',()=>{
 const {ctx,get}=boot();get('bitrate').value='4321';ctx.applyPreset('unknown');assert.equal(get('bitrate').value,'4321');
});
