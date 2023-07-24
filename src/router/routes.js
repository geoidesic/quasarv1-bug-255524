/**
 Is there a way to use the Vue instance in routes.js? 
 e.g. I want to be able to dispatch an action before entering a route... so I need this.$store.
Yusuf Kandemir (EN/TR)Today at 9:31 AM
@Noel you can wrap it in a function, then supply the parameters you want
// router/routes.js
export default store => {
  return [
    // your routes here
  ]
}
// router/index.js
import createRoutes from './routes'
// ...
routes: createRoutes(this.$store)
*/

import { RouterError } from "src/exceptions";
import { notify } from "../utils/";

export default (Vue, store) => {

  return [
    {
      path: "/",
      component: () => import("layouts/DefaultLoggedIn.vue"),
      beforeEnter: async (to, from, next) => {
        next()
      },

      children: [
        { path: "", component: () => import("pages/Index.vue") },
       
       
      ],
    },
    
    
    // Always leave this as last one,
    // but you can also remove it
    {
      path: "*",
      component: () => import("pages/Error404.vue"),
    },
  ];
};
