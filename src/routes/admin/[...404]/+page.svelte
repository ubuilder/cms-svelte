<script>
  import { t } from '$lib/i18n';
    import {Page} from '@ulibs/yesvelte'
</script>

<Page title={t('title_404')}>
    {t('admin.page_not_found')}
    <a href="/admin">{t('admin.go_back')}</a>
</Page>