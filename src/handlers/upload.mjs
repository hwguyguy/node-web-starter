export function show(ctx) {
	ctx.view = 'upload'
	ctx.data = {
		title: 'Upload',
	}
}

export async function handle(ctx) {
	const body = await ctx.getBody()
	console.log(body)
	ctx.respond('Uploaded', 200)
}
