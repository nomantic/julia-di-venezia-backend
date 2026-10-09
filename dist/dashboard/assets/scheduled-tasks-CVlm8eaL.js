import{a as S,ad as R,aR as b,aQ as f,aS as o,aU as t,aT as h,aj as D,j as e,a8 as E,c4 as d,ao as a,ay as x,aC as A,aD as M,f5 as q,aE as v,aI as j,bV as C,bW as L,bZ as P,b_ as I,f6 as Q,a_ as c,f7 as N}from"./index-BvFIWMiL.js";import{P as z}from"./payload-dialog-BmljQrv0.js";const J=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"10 8 16 12 10 16 10 8",key:"1cimsy"}]],F=S("CirclePlay",J),K=c(`
    query ScheduledTasks {
        scheduledTasks {
            id
            description
            schedule
            scheduleDescription
            lastExecutedAt
            nextExecutionAt
            isRunning
            lastResult
            enabled
        }
    }
`),U=c(`
    mutation UpdateScheduledTask($input: UpdateScheduledTaskInput!) {
        updateScheduledTask(input: $input) {
            id
            enabled
        }
    }
`),_=c(`
    mutation RunScheduledTask($id: String!) {
        runScheduledTask(id: $id) {
            success
        }
    }
`);function H(){const{_:i}=R(),{data:l}=b({queryKey:["scheduledTasks"],queryFn:()=>t.query(K)}),r=f(),{mutate:m}=o({mutationFn:t.mutate(U),onSuccess:s=>{u()}}),u=()=>{r.invalidateQueries({queryKey:["scheduledTasks"]})},{mutate:p}=o({mutationFn:t.mutate(_),onSuccess:s=>{s.runScheduledTask.success?(h.success(i({id:"96xJ48"})),r.invalidateQueries({queryKey:["scheduledTasks"]})):h.error(i({id:"DzhRjJ"}))}}),{formatDate:g,formatRelativeDate:y}=D(),k={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"},n=N(),T=[n.accessor("id",{header:i({id:"S0kLOH"}),cell:({getValue:s})=>e.jsx(E,{value:s(),children:e.jsx("span",{className:"font-mono",children:s()})})}),n.accessor("description",{header:i({id:"Nu4oKW"})}),n.accessor("enabled",{header:i({id:"RxzN1M"}),cell:({row:s})=>s.original.enabled?e.jsx(d,{variant:"success",children:e.jsx(a,{id:"RxzN1M"})}):e.jsx(d,{variant:"secondary",children:e.jsx(a,{id:"E/QGRL"})})}),n.accessor("schedule",{header:i({id:"pIxz4h"})}),n.accessor("scheduleDescription",{header:i({id:"gmB6oO"})}),n.accessor("lastExecutedAt",{header:i({id:"RhpMfE"}),cell:({row:s})=>s.original.lastExecutedAt?e.jsx("div",{title:s.original.lastExecutedAt,children:y(s.original.lastExecutedAt)}):e.jsx(a,{id:"qqeAJM"})}),n.accessor("nextExecutionAt",{header:i({id:"WwKMiy"}),cell:({row:s})=>s.original.nextExecutionAt?g(s.original.nextExecutionAt,k):e.jsx(a,{id:"qqeAJM"})}),n.accessor("isRunning",{header:i({id:"RiQMUh"}),cell:({row:s})=>s.original.isRunning?e.jsx(d,{variant:"success",children:e.jsx(a,{id:"RiQMUh"})}):e.jsx(d,{variant:"secondary",children:e.jsx(a,{id:"LXcUnJ"})})}),n.accessor("lastResult",{header:i({id:"ikhZzI"}),cell:({row:s})=>s.original.lastResult?e.jsx(z,{payload:s.original.lastResult,title:e.jsx(a,{id:"bDEHSp"}),description:e.jsx(a,{id:"swNxZp"}),trigger:e.jsx(x,{size:"sm",variant:"secondary",children:e.jsx(a,{id:"xwytAA"})})}):e.jsx("div",{className:"text-muted-foreground",children:e.jsx(a,{id:"YTKVwL"})})}),n.display({id:"actions",header:i({id:"7L01XJ"}),cell:({row:s})=>e.jsxs(A,{children:[e.jsx(M,{render:e.jsx(x,{variant:"ghost",size:"icon"}),children:e.jsx(q,{})}),e.jsxs(v,{children:[s.original.enabled&&e.jsxs(j,{onClick:()=>p({id:s.original.id}),children:[e.jsx(F,{className:"w-4 h-4"}),e.jsx(a,{id:"3JjdaA"})]}),e.jsx(j,{onClick:()=>m({input:{id:s.original.id,enabled:!s.original.enabled}}),children:s.original.enabled?e.jsx(a,{id:"cO9+2L"}):e.jsx(a,{id:"PaQ3df"})})]})]})})];return e.jsxs(C,{pageId:"scheduled-tasks-list",children:[e.jsx(L,{children:e.jsx(a,{id:"8OiyFS"})}),e.jsx(P,{children:e.jsx(I,{blockId:"list-table",children:e.jsx(Q,{onRefresh:u,columns:T,data:l?.scheduledTasks??[],totalItems:l?.scheduledTasks?.length??0,defaultColumnVisibility:{schedule:!1}})})})]})}export{H as component};
