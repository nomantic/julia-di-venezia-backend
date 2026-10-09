import{aR as e,a_ as a,aU as r}from"./index-BvFIWMiL.js";const i=["availableCountries"],t=a(`
    query GetAvailableCountries {
        countries(options: { filter: { enabled: { eq: true } } }) {
            items {
                id
                code
                name
            }
        }
    }
`);function s(){return e({queryKey:i,queryFn:()=>r.query(t),staleTime:1e3*60*5})}export{i as a,s as u};
