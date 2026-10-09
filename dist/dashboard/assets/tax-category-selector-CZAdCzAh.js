import{aR as l,j as a,fW as c,ar as u,as as m,at as x,ao as d,au as p,fX as g,av as j,a_ as h,aU as f}from"./index-BvFIWMiL.js";const C=h(`
    query TaxCategories($options: TaxCategoryListOptions) {
        taxCategories(options: $options) {
            items {
                id
                name
                isDefault
            }
        }
    }
`);function T({value:t,onChange:i}){const{data:s,isLoading:r,isPending:n,status:S}=l({queryKey:["taxCategories"],queryFn:()=>f.query(C,{options:{take:100}})});return r||n?a.jsx(c,{className:"h-10 w-full"}):a.jsxs(u,{items:s?Object.fromEntries(s.taxCategories.items.map(e=>[e.id,e.name])):{},value:t??"",onValueChange:e=>e&&i(e),children:[a.jsx(m,{children:a.jsx(x,{placeholder:a.jsx(d,{id:"LWiFS0"}),children:e=>s?.taxCategories.items.find(o=>o.id===e)?.name})}),a.jsx(p,{children:s&&a.jsx(g,{children:s?.taxCategories.items.map(e=>a.jsx(j,{value:e.id,children:e.name},e.id))})})]})}export{T};
