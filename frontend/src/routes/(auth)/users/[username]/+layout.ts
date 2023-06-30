
export function load({ params }): {username: string, route: string} {
	return {
		username: params.username,
		route: `/users/${params.username}`,
	}
}