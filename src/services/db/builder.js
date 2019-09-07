import knex from 'knex'

const DEFAULT_PAGE_SIZE = 20

export const builder = knex({
	client: 'mysql'
})

export function limitize(p) {
	let page, size

	if (typeof p === 'number') {
		page = p
	} else {
		page = p.page
		size = p.size
	}

	if (page < 1) {
		page = 1
	}

	if (!size || size < 1) {
		size = DEFAULT_PAGE_SIZE
	}

	return {
		offset: (page - 1) * size,
		rowCount: size,
	}
}
