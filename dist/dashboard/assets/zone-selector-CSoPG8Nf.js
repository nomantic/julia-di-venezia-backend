import{aR as l,j as s,fW as c,ar as m,as as d,at as u,ao as p,au as h,fX as j,av as x,a_ as f,aU as S}from"./index-BvFIWMiL.js";const g=f(`
    query Zones($options: ZoneListOptions) {
        zones(options: $options) {
            items {
                id
                name
            }
        }
    }
`);function q({value:n,onChange:t}){const{data:a,isLoading:i,isPending:o}=l({queryKey:["zones"],queryFn:()=>S.query(g,{options:{take:100}})});return i||o?s.jsx(c,{className:"h-10 w-full"}):s.jsxs(m,{items:a?Object.fromEntries(a.zones.items.map(e=>[e.id,e.name])):{},value:n??"",onValueChange:e=>e&&t(e),children:[s.jsx(d,{children:s.jsx(u,{placeholder:s.jsx(p,{id:"p3M+0h"}),children:e=>a?.zones.items.find(r=>r.id===e)?.name})}),s.jsx(h,{children:a&&s.jsx(j,{children:a?.zones.items.map(e=>s.jsx(x,{value:e.id,children:e.name},e.id))})})]})}export{q as Z};
