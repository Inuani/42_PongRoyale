// pre-loading data before component in +page.svelte is rendered.
export function load({ params }) {
	return {
		invite_link: params.invite_link,
	}
}