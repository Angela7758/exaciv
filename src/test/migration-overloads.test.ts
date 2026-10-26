import {describe,it,expect} from 'vitest';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';

// Static guard: a CREATE OR REPLACE with a different argument list adds an overload
// instead of replacing the function, which makes calls ambiguous at runtime.
// This test fails if two live signatures share a function name without a later DROP.
const DIR=join(__dirname,'../../drizzle/migrations');
// Known historical overloads that were later dropped (name -> dropped signatures).
const EXCEPTIONS:Record<string,string[]>={};

function signatures(sql:string){
 const creates=[...sql.matchAll(/CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?([a-z0-9_]+)\s*\(([^)]*)\)/gi)];
 const drops=[...sql.matchAll(/DROP\s+FUNCTION\s+(?:IF\s+EXISTS\s+)?(?:public\.)?([a-z0-9_]+)\s*\(([^)]*)\)/gi)];
 const norm=(args:string)=>args.replace(/--[^\n]*/g,'').split(',').map(a=>a.trim().split(/\s+/).pop()!.toLowerCase()).filter(Boolean).join(',');
 return {creates:creates.map(m=>({name:m[1].toLowerCase(),args:norm(m[2])})),drops:drops.map(m=>({name:m[1].toLowerCase(),args:norm(m[2])}))};
}

describe('Migration function overloads',()=>{
 it('no public function keeps two live signatures without a later DROP',()=>{
  const files=readdirSync(DIR).filter(f=>f.endsWith('.sql')).sort();
  const live=new Map<string,Set<string>>();
  for(const file of files){
   const sql=readFileSync(join(DIR,file),'utf8');
   const {creates,drops}=signatures(sql);
   for(const d of drops) live.get(d.name)?.delete(d.args);
   for(const c of creates){
    if(!live.has(c.name)) live.set(c.name,new Set());
    live.get(c.name)!.add(c.args);
   }
  }
  const violations:string[]=[];
  for(const [name,sigs] of live){
   const excepted=new Set(EXCEPTIONS[name]??[]);
   const remaining=[...sigs].filter(s=>!excepted.has(s));
   if(remaining.length>1) violations.push(`${name}: ${remaining.join(' | ')}`);
  }
  expect(violations).toEqual([]);
 });
});
