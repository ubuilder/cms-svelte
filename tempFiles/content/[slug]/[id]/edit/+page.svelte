<script lang="ts">
	import FieldInput from '$lib/components/content/FieldInput.svelte'
  import {enhance} from '$app/forms'
	import { t } from '$lib/i18n'
	import { Button, Card, CardBody, El, ButtonList, Page } from '@ulibs/yesvelte'

	export let data
	export let form


	// async function onSubmit() {
	// 	const value2: any = {}

	// 	for (let field of data.table.fields) {
	// 		if (
	// 			field.type === 'relation' &&
	// 			typeof value[field.name] === 'object' &&
	// 			!Array.isArray(value[field.name])
	// 		) {
	// 			console.log('multiple: ' + field.multiple)
	// 			if (field.multiple) {
	// 				console.log('yes')
	// 				value2[field.name] = value[field.name].map((x: any) => x.id)
	// 			} else {
	// 				console.log('no')
	// 				value2[field.name] = value[field.name].id
	// 			}
	// 		} else {
	// 			value2[field.name] = value[field.name]
	// 		}
	// 	}

	// 	value2['id'] = value.id

	// 	await fetch('../../' + '?/update', { method: 'POST', body: JSON.stringify(value2) }).then(
	// 		(res) => res.json()
	// 	)
	// 	await goto('../..', { invalidateAll: true })
	// }

	let value: any = data.value
</script>

<Page title="Update {data.table.name} ({data.value.id})" back>
	<Card>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" value={data.value.id} name="id"/>
			<CardBody row>
				{#each data.table.fields as field}
					{@const errorMessage = form?.field === field.name ? form.message : undefined}
					<FieldInput {errorMessage} {field} bind:data={value} />
				{/each}

				<El col d="flex" mt="3">
					<ButtonList ms="auto">
						<Button>{t('buttons.cancel')}</Button>

						<Button type="submit" color="primary">
							{t('buttons.update')}
						</Button>
					</ButtonList>
				</El>
			</CardBody>
		</form>
	</Card>
</Page>
