import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { pipeline } from '@huggingface/transformers';
let model;
const server=http.createServer(async(req,res)=>{
 try{
  if(req.method==='GET'&&(req.url==='/'||req.url==='/client.js')){res.setHeader('Content-Type',req.url==='/'?'text/html; charset=utf-8':'text/javascript; charset=utf-8');res.end(await readFile(new URL(req.url==='/'?'./local-index.html':'./local-client.js',import.meta.url)));return;}
  if(req.method!=='POST'||req.url!=='/generate'){res.writeHead(404);res.end('Not found');return;}
  // Only local same-origin browser requests are accepted. No external API token.
  if(req.headers.origin && req.headers.origin!=='http://127.0.0.1:8787'&&req.headers.origin!=='http://localhost:8787'){res.writeHead(403);res.end();return;}
  let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)throw Error('Request too large');}
  const {shop,facts}=JSON.parse(body);if(typeof shop!=='string'||typeof facts!=='string'||!shop.trim()||!facts.trim()||shop.length>80||facts.length>400)throw Error('Supply a shop name and short offer facts.');
  const start=Date.now();
  model??=pipeline('text-generation','onnx-community/SmolLM2-360M-Instruct-ONNX',{dtype:'q8',device:'cpu'});
  const generator=await model;
  const result=await generator([{role:'user',content:`Rewrite this as one short friendly sentence. Do not add any facts: ${shop} has ${facts}`}],{max_new_tokens:80,do_sample:false,repetition_penalty:1.2});
  const draft=result[0].generated_text.at(-1).content.trim();
  res.setHeader('Content-Type','application/json');res.end(JSON.stringify({draft,seconds:((Date.now()-start)/1000).toFixed(1)}));
 }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:e.message}));}
});
server.listen(8787,'127.0.0.1',()=>console.log('DukaanDraft: http://127.0.0.1:8787 - local open-weight AI. First generation downloads model weights.'));
