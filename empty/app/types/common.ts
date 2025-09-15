export interface IListMarathon {
	buy_link: string;
	is_new_user: boolean;
	have_workout: boolean;
	have_subscription: boolean;
	user: {
		id: string;
		firstname: string;
		lastname: string;
		avatar_url: string;
		password: string | null;
		email: string | null;
		phone: string | null;
	};
	workout: {
		id: string;
		title: string;
		price: number;
		description: string;
	}
}
