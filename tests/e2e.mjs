import pkg from 'playwright';
const { chromium } = pkg;
const base = process.env.BASE_URL || 'http://localhost:4173'; const errs=[];
const b = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await b.newContext();
await ctx.addInitScript(()=>localStorage.setItem('ztd_progress_v1',JSON.stringify({completed:{},badges:{},theme:null,riskAck:true})));
const p = await ctx.newPage();
p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
p.on('console',m=>{ if(m.type()==='error'&&!/Failed to load resource/.test(m.text())) errs.push('CONSOLE '+m.text()); });
const go = async id => { await p.goto(`${base}/index.html#/level/${id}`,{waitUntil:'networkidle'}); };
const st = async (n,f)=>{ try{ await f(); console.log('✓',n);}catch(e){ console.log('✗',n,'—',e.message.split('\n')[0]); errs.push(n);} };
const B = t => p.locator('button',{hasText:t});

await st('1 界線判斷', async()=>{ await go('boundary');
  await p.click('text=來判斷幾個實際情境');
  const ans=['✅ 可以自己做','⛔ 不該這樣做','✅ 可以自己做','⛔ 不該這樣做','⚠️ 先問資訊單位','✅ 可以自己做'];
  for(let i=0;i<6;i++){ await p.click(`text=${ans[i]}`); await p.waitForSelector('text=判斷正確',{timeout:2500});
    await p.click(i===5?'text=完成這一關':'text=下一題'); }
  await p.waitForSelector('text=界線意識達成',{timeout:3000}); });

await st('2 網站怎麼被看到', async()=>{ await go('intro');
  await p.click('text=我懂了，下一步');
  await p.click('text=因為筆電會關機');
  await p.waitForSelector('text=把你的網頁「放上」伺服器',{timeout:4000});
  await p.click('text=📄 index.html'); await p.click('text=把檔案放進來');
  await p.waitForSelector('text=第一關完成',{timeout:4000}); });

await st('3 GitHub Pages', async()=>{ await go('github-pages');
  await p.click('text=靜態網站：HTML');
  await B('先在模擬介面練一次').click();
  await p.click('.gh-btn-green'); await p.waitForSelector('text=Create a new repository');
  await p.click('.gh-btn-green'); await p.waitForSelector('text=拖曳檔案到這裡上傳');
  await p.click('text=📄 index.html'); await p.click('text=拖曳檔案到這裡上傳');
  await p.waitForFunction(()=>{const x=document.querySelector('.gh-btn-green');return x&&!x.disabled});
  await p.click('.gh-btn-green'); await p.waitForSelector('text=Branch');
  await p.click('.gh-btn-green'); await p.waitForSelector('text=Your site is live');
  await p.click('text=我真的做一次');
  for(const c of await p.$$('input[type=checkbox]')) await c.check();
  await p.fill('input[type=url]','https://me.github.io/site/');
  await p.click('text=驗證我的網站');
  await p.waitForSelector('text=你把網站部署上線了',{timeout:4000}); });

await st('4 API 基礎', async()=>{ await go('api');
  await p.click('text=自己送一個 request');
  await p.click('text=查一個使用者').catch(()=>p.click('text=查空氣品質'));
  await B('送出 Send').click(); await p.waitForSelector('text=200 OK',{timeout:3000});
  await p.click('text=試試真的 API');
  await p.click('text=你送了一個 GET 請求');
  await B('完成這一關').click();
  await p.waitForSelector('text=API 入門達成',{timeout:3000}); });

await st('5 GAS 推送', async()=>{ await go('gas');
  await p.click('text=讓它跑一次給你看'); await p.click('text=定時觸發');
  await B('執行 GAS').click(); await p.waitForSelector('text=申辦通知機器人',{timeout:3000});
  await B('看看真的怎麼設').click();
  await B('把訊息 POST 出去').click();
  await B('完成這一關').click();
  await p.waitForSelector('text=自動推播達成',{timeout:3000}); });

await st('6 Hugging Face', async()=>{ await go('huggingface');
  await p.click('text=部署一個 AI Demo 來玩'); await p.click('.gh-btn-green');
  await p.waitForSelector('text=民意情緒分析 Demo',{timeout:4000});
  await B('分析 Analyze').click(); await p.waitForSelector('text=信心',{timeout:3000});
  await B('看看真的怎麼做').click();
  await B('GitHub Pages 只能放純靜態網頁').click();
  await B('完成這一關').click();
  await p.waitForSelector('text=AI 應用上線達成',{timeout:3000}); });

await st('7 自架（內網/對外）', async()=>{ await go('selfhost');
  await p.click('text=試試看誰連得上');
  const sw=await p.$$('[role=switch]'); await sw[0].click(); await sw[1].click();
  await p.click('text=同仁從內網連線'); await p.waitForSelector('text=資料完全沒有離開機關',{timeout:3000});
  await B('在自己電腦實際跑一個').click();
  await B('對外提供服務要先經資安評估與核准').click();
  await B('完成這一關').click();
  await p.waitForSelector('text=內網與對外的差別',{timeout:3000}); });

await st('8 Docker', async()=>{ await go('docker');
  await p.click('text=自己打包一個來跑');
  await B('docker build').click(); await p.waitForSelector('text=Image 打包完成',{timeout:3000});
  await B('docker run').click(); await p.waitForSelector('text=同事那台乾淨電腦沒裝 Node',{timeout:3000});
  await p.click('text=把「環境」也打包進去');
  await B('docker build').click(); await p.waitForSelector('text=已含環境',{timeout:3000});
  await B('docker run').click(); await p.waitForSelector('text=結果一模一樣',{timeout:3000});
  await B('看看真的怎麼寫').click();
  await B('避免「我電腦能跑').click();
  await B('完成這一關').click();
  await p.waitForSelector('text=打包貨櫃達成',{timeout:3000}); });

await st('9 EXE / Queue（全線通關）', async()=>{ await go('exe-queue');
  await p.click('text=玩玩看工作佇列');
  const sub=B('送出任務'); for(let i=0;i<4;i++){ await sub.click(); await p.waitForTimeout(110); }
  await p.waitForFunction(()=>{const x=[...document.querySelectorAll('button')].find(e=>e.textContent.includes('看看 EXE'));return x&&!x.disabled},{timeout:9000});
  await B('看看 EXE').click();
  await B('打包成 EXE').click(); await p.waitForSelector('text=打包完成',{timeout:3000});
  await B('讓使用者不用站著等').click();
  await B('完成整張地圖').click();
  await p.waitForSelector('text=全線通關',{timeout:3000}); });

await st('「回上一步」可用（新增功能）', async()=>{ await go('api');
  await p.click('text=自己送一個 request');
  await p.waitForSelector('text=送出一個 API 請求');
  await p.click('text=回上一步');
  await p.waitForSelector('text=API 是什麼',{timeout:2500}); });

await st('地圖：9 關全完成 → 100%', async()=>{
  await p.goto(base+'/index.html#/map',{waitUntil:'networkidle'});
  await p.waitForSelector('text=我的徽章');
  const pct=await p.$eval('header .text-right',e=>e.textContent);
  if(pct.trim()!=='100%') throw new Error('進度 '+pct);
  const done=(await p.$$('[data-testid=trail] .is-done, [data-node]')).length;
  console.log('   進度：',pct); });

console.log('\n錯誤：', errs.length? errs.join(' | ') : '（無）');
await b.close(); process.exit(errs.length?1:0);
