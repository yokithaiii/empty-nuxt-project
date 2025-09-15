export interface IStore {
	email: string | null;
	phone: string | null;
	firstname: string | null;
	lastname: string | null;
	password: string | null;
	avatar: string | null;
	buy_link: string | null;
	is_new_user: boolean;
	have_workout: boolean;
}