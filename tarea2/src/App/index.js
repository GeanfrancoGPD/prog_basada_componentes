import Slice from "/Slice/Slice.js";

await slice.build("ApiServices", { sliceId: "Api-Services" });

const modal = await slice.build("Modal");
document.body.appendChild(modal);

/*
slice.router.beforeEach(async (to, from, next) => {
  
   if(to.metadata.private){
      const isAuthenticated = await //fetchlogic for validation
      if(!isAuthenticated){
         return next({ path: '/login', replace: true });
      }
      return next();
   }
   
   return next();
});


If any beforeEach or afterEach is defined, start the router after defining them

await slice.router.start();

*/
