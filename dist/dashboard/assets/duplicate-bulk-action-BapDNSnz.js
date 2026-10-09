import{a_ as h,cQ as k,r as x,aR as b,bc as q,j as e,aB as T,al as _,am as F,an as P,ao as c,ap as B,aw as M,ay as $,aU as v,c8 as O,ad as U,aS as V,cR as Q,aT as I}from"./index-BvFIWMiL.js";import{D as Y}from"./data-table-bulk-action-item-DBP6yvNu.js";import{g as G,C as H}from"./configurable-operation-utils-BH-PC7-h.js";const K=h(`
    mutation DuplicateEntity($input: DuplicateEntityInput!) {
        duplicateEntity(input: $input) {
            ... on DuplicateEntitySuccess {
                newEntityId
            }
            ... on ErrorResult {
                errorCode
                message
            }
            ... on DuplicateEntityError {
                duplicationError
            }
        }
    }
`),N=h(`
        query GetEntityDuplicators {
            entityDuplicators {
                code
                description
                requiresPermission
                forEntities
                args {
                    ...ConfigArgDefinition
                }
            }
        }
    `,[k]);h(`
    mutation CreateCustomerInputTypeRef($input: CreateCustomerInput!) {
        createCustomer(input: $input) {
            __typename
        }
    }
`);h(`
    mutation CreateAddressInputTypeRef($customerId: ID!, $input: CreateAddressInput!) {
        createCustomerAddress(customerId: $customerId, input: $input) {
            __typename
        }
    }
`);function X({open:f,onOpenChange:d,entityType:C,entityName:a,duplicatorCode:g,onConfirm:o}){const[i,l]=x.useState(),{data:j}=b({queryKey:["entityDuplicators"],queryFn:()=>v.query(N),staleTime:1e3*60*60*5}),s=j?.entityDuplicators?.find(n=>n.code===g&&n.forEntities.includes(C));q.useEffect(()=>{s&&!i&&l({code:s.code,arguments:s.args?.map(n=>({name:n.name,value:G(n)}))||[]})},[s,i]);const D=n=>{l(n)},y=()=>{i&&(o(i),d(!1),l(void 0))},p=()=>{d(!1),l(void 0)};return e.jsx(T,{open:f,onOpenChange:d,children:e.jsxs(_,{className:"sm:max-w-lg",children:[e.jsxs(F,{children:[e.jsx(P,{children:e.jsx(c,{id:"Lns7sP",values:{0:a.toLowerCase()}})}),e.jsx(B,{className:"sr-only",children:e.jsx(c,{id:"bX+LyM",values:{0:a.toLowerCase()}})})]}),e.jsxs("div",{className:"space-y-4",children:[i&&s&&e.jsx(H,{operationDefinition:s,value:i,onChange:D,removable:!1}),!s&&e.jsx("div",{className:"text-sm text-muted-foreground",children:e.jsx(c,{id:"B6LoY7",values:{duplicatorCode:g,entityName:a}})})]}),e.jsxs(M,{children:[e.jsx($,{variant:"outline",onClick:p,children:e.jsx(c,{id:"dEgA5A"})}),e.jsx($,{onClick:y,disabled:!i,children:e.jsx(c,{id:"euc6Ns"})})]})]})})}function Z({entityType:f,duplicatorCode:d,requiredPermissions:C,entityName:a,onSuccess:g,selection:o,table:i}){const{refetchPaginatedList:l}=O(),{_:j}=U(),[s,D]=x.useState(!1),[y,p]=x.useState({completed:0,total:0}),[n,E]=x.useState(!1),{mutateAsync:w}=V({mutationFn:v.mutate(K)}),A=()=>{s||E(!0)},L=async R=>{if(s)return;D(!0),p({completed:0,total:o.length});const t={success:0,failed:0,errors:[]};try{for(let r=0;r<o.length;r++){const m=o[r];try{const u=await w({input:{entityName:f,entityId:m.id,duplicatorInput:R}});if("newEntityId"in u.duplicateEntity)t.success++;else{t.failed++;const S=u.duplicateEntity.message||u.duplicateEntity.duplicationError||"Unknown error";t.errors.push(`${a} ${m.name||m.id}: ${S}`)}}catch(u){t.failed++,t.errors.push(`${a} ${m.name||m.id}: ${u instanceof Error?u.message:"Unknown error"}`)}p({completed:r+1,total:o.length})}if(t.success>0){const r=t.success;I.success(j({id:"YRTdLc",values:{count:r,entityName:a}}))}if(t.failed>0){const r=t.errors.length>3?`${t.errors.slice(0,3).join(", ")}... and ${t.errors.length-3} more`:t.errors.join(", ");I.error(`Failed to duplicate ${t.failed} ${a.toLowerCase()}s: ${r}`)}t.success>0&&(l(),i.resetRowSelection(),g?.())}finally{D(!1),p({completed:0,total:0})}};return e.jsxs(e.Fragment,{children:[e.jsx(Y,{requiresPermission:C,onClick:A,label:s?e.jsx(c,{id:"+lpe0V",values:{0:y.completed,1:y.total}}):e.jsx(c,{id:"euc6Ns"}),icon:Q,closeOnClick:!1}),e.jsx(X,{open:n,onOpenChange:E,entityType:f,entityName:a,entities:o,duplicatorCode:d,onConfirm:L})]})}export{Z as D};
