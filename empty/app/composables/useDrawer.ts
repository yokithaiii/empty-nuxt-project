import type { IDrawer } from "~/types/drawer";

export default function () {
	return useState<IDrawer>('drawer-content', () => {
		return {
			isOpen: false,
			state: null,
			paymentUrl: null,
		};
	});
}
