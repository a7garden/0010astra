import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Title,
  TextInput,
  Select,
  Group,
  SimpleGrid,
  Stack,
  Badge,
  Anchor,
  Box,
  CloseButton,
  Text as MantineText,
} from '@mantine/core';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import { concepts, search, getCategories, getTags } from '../data';
import ConceptCard from '../components/ConceptCard';

export default function ConceptsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [tag, setTag] = useState(searchParams.get('tag') || '');

  const categories = getCategories();
  const tags = getTags();

  // Sync URL params to state on mount / navigation
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || '');
    setTag(searchParams.get('tag') || '');
  }, [searchParams]);

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, val] of Object.entries(updates)) {
      if (val) {
        next.set(key, val);
      } else {
        next.delete(key);
      }
    }
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let result = concepts;

    if (query.trim()) {
      result = search(query);
    }
    if (category) {
      result = result.filter((c) => c.category === category);
    }
    if (tag) {
      result = result.filter((c) => c.tags.includes(tag));
    }

    return result;
  }, [query, category, tag]);

  const hasFilters = query || category || tag;

  return (
    <Stack gap="lg" py="md">
      <Title order={2}>Concepts</Title>

      {/* Search & Filters */}
      <Stack gap="sm">
        <TextInput
          placeholder="Search concepts by title, alias, tag, or content..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            updateParams({ q: e.currentTarget.value });
          }}
        />
        <Group gap="sm" wrap="wrap">
          <Select
            placeholder="Category"
            clearable
            data={categories.map((c) => ({ value: c, label: c }))}
            value={category}
            onChange={(val) => {
              setCategory(val || '');
              updateParams({ category: val || '' });
            }}
            w={200}
          />
          <Select
            placeholder="Tag"
            clearable
            data={tags.map((t) => ({ value: t, label: t }))}
            value={tag}
            onChange={(val) => {
              setTag(val || '');
              updateParams({ tag: val || '' });
            }}
            w={200}
          />
          {hasFilters && (
            <CloseButton
              onClick={() => {
                setQuery('');
                setCategory('');
                setTag('');
                setSearchParams({}, { replace: true });
              }}
              variant="subtle"
              title="Clear filters"
            />
          )}
        </Group>
      </Stack>

      {/* Results count */}
      <MantineText size="sm" c="dimmed">
        {filtered.length} concept{filtered.length !== 1 ? 's' : ''} found
        {hasFilters ? ' (filtered)' : ''}
      </MantineText>

      {/* Grid */}
      {filtered.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {filtered.map((concept) => (
            <ConceptCard key={concept.slug} concept={concept} />
          ))}
        </SimpleGrid>
      ) : (
        <Box ta="center" py="xl">
          <MantineText c="dimmed" size="lg">
            No concepts found matching your filters.
          </MantineText>
          <Anchor
            size="sm"
            mt="sm"
            onClick={() => {
              setQuery('');
              setCategory('');
              setTag('');
              setSearchParams({}, { replace: true });
            }}
          >
            Clear all filters
          </Anchor>
        </Box>
      )}
    </Stack>
  );
}
