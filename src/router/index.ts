import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import MainView from "@/views/MainView.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "home",
		component: MainView,
		meta: {
			title: "Kudos Calendar",
			description: "Kudos Calendar App",
		},
	},
	{
		path: "/about",
		name: "about",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
