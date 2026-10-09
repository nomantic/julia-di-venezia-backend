import{a as L,c8 as k,ad as y,aS as S,aT as u,cT as N,aU as b,d1 as P,j as t,ao as g,r as i,aQ as T,d2 as _,d3 as F,c7 as M,ay as D,ae as G,cS as $,a_ as q}from"./index-BvFIWMiL.js";import{C as I}from"./customer-selector-CxOeUoig.js";import{D as Q}from"./data-table-bulk-action-item-DBP6yvNu.js";const R=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]],B=L("UserMinus",R);function E(a){return function({selection:r,table:c}){const{refetchPaginatedList:m}=k(),{_:d}=y(),n=r.length,{mutate:l,isPending:p}=S({mutationFn:b.mutate(P),onSuccess:()=>{u.success(N._({id:"T8gVni",values:{count:n}})),m(),c.resetRowSelection()},onError:o=>{u.error(d({id:"tb6I7X"}),{description:o.message})}});return t.jsx(Q,{requiresPermission:["UpdateCustomerGroup"],onClick:()=>l({customerGroupId:a,customerIds:r.map(o=>o.id)}),disabled:p,label:t.jsx(g,{id:"LNV3uL"}),confirmationText:t.jsx(g,{id:"FZk7Sh",values:{count:n}}),icon:B,className:"text-destructive"})}}const x=q(`
    query CustomerGroupMemberList($id: ID!, $options: CustomerListOptions) {
        customerGroup(id: $id) {
            customers(options: $options) {
                items {
                    id
                    createdAt
                    updatedAt
                    firstName
                    lastName
                    emailAddress
                }
                totalItems
            }
        }
    }
`);function K({customerGroupId:a,canAddCustomers:f=!0}){const[r,c]=i.useState([]),[m,d]=i.useState(1),[n,l]=i.useState(10),[p,o]=i.useState([]),{_:C}=y(),h=T(),j=i.useMemo(()=>[{component:E(a)}],[a]),{mutate:v}=S({mutationFn:b.mutate(F),onSuccess:()=>{u.success(C({id:"y3tQ/s"})),h.invalidateQueries({queryKey:[_,x]})},onError:()=>{u.error(C({id:"ZlA28n"}))}});return t.jsxs("div",{children:[t.jsx(M,{listQuery:$(x),transformVariables:e=>({...e,id:a}),bulkActions:j,page:m,itemsPerPage:n,sorting:r,columnFilters:p,onPageChange:(e,s,A)=>{d(s),l(A)},onSortChange:(e,s)=>{c(s)},onFilterChange:(e,s)=>{o(s)},onSearchTermChange:e=>({lastName:{contains:e},emailAddress:{contains:e}}),additionalColumns:{name:{header:"Name",cell:({row:e})=>{const s=`${e.original.firstName} ${e.original.lastName}`;return t.jsx(D,{render:t.jsx(G,{to:"/customers/$id",params:{id:e.original.id}}),variant:"ghost",children:s})}}},defaultColumnOrder:["name","emailAddress"],defaultVisibility:{id:!1,createdAt:!1,updatedAt:!1,firstName:!1,lastName:!1}}),f&&t.jsx(I,{onSelect:e=>{v({customerId:e.id,groupId:a})},label:t.jsx(g,{id:"IswRMs"})})]})}export{K as C};
