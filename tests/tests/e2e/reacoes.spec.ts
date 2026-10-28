import { test, expect } from '@playwright/test';

test.describe('E2E - likes e dislikes', () => {
  // Requisito coberto: a Home mostra o numero de likes e dislikes junto a cada post
  test('cada post da home mostra a quantidade de likes e dislikes', async ({ page }) => {
    await page.goto('/');
    // Cada post e um "listitem". Os posts vem do dummyjson, entao damos mais tempo.
    const primeiroPost = page.getByRole('listitem').first();
    await expect(primeiroPost).toBeVisible({ timeout: 15000 });

    // Os contadores aparecem como "👍 192" e "👎 25" (numero depois do emoji)
    await expect(primeiroPost.getByLabel('Likes')).toHaveText(/\d+/);
    await expect(primeiroPost.getByLabel('Dislikes')).toHaveText(/\d+/);
  });
});
