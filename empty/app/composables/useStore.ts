import type { IStore } from "~/types/store";

export default function () {
	return useState<IStore>('base-store', () => {
		return {
			email: null,
			phone: null,
			firstname: null,
			lastname: null,
			password: null,
			avatar: null,
			buy_link: null,
			have_workout: false,
			is_new_user: false,
		}
	});
}
