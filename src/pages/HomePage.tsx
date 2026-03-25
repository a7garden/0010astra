import {
  Title,
  Text,
  SimpleGrid,
  Group,
  Badge,
  Stack,
  Card,
  Box,
  Anchor,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconSparkles, IconBooks, IconTag } from '@tabler/icons-react';
import { meta, getBySlug, concepts } from '../data';
import ConceptCard from '../components/ConceptCard';

export default function HomePage() {
  const recentConcepts = meta.recent
    .map((slug) => getBySlug(slug))
    .filter(Boolean);

  const topCategories = Object.entries(meta.categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const topTags = Object.entries(meta.tags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);

  return (
    <Stack gap="xl" py="md">
      {/* Hero */}
      <Box ta="center" py="xl">
        <Title order={1} mb="sm">
          ✨ Astra Knowledge Base
        </Title>
        <Text size="lg" c="dimmed" maw={600} mx="auto">
          {meta.total}개의 핵심 개념 카드로 구성된 지식 베이스입니다.
          과학, 수학, 컴퓨터 과학 등 다양한 분야의 개념을 탐색하세요.
        </Text>
      </Box>

      {/* Stats */}
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Card withBorder padding="lg" radius="md">
          <Group gap="sm">
            <IconSparkles size={24} color="var(--mantine-color-violet-6)" />
            <Box>
              <Text size="sm" c="dimmed">Total Concepts</Text>
              <Title order={2}>{meta.total}</Title>
            </Box>
          </Group>
        </Card>
        <Card withBorder padding="lg" radius="md">
          <Group gap="sm">
            <IconBooks size={24} color="var(--mantine-color-blue-6)" />
            <Box>
              <Text size="sm" c="dimmed">Categories</Text>
              <Title order={2}>{Object.keys(meta.categories).length}</Title>
            </Box>
          </Group>
        </Card>
        <Card withBorder padding="lg" radius="md">
          <Group gap="sm">
            <IconTag size={24} color="var(--mantine-color-teal-6)" />
            <Box>
              <Text size="sm" c="dimmed">Unique Tags</Text>
              <Title order={2}>{Object.keys(meta.tags).length}</Title>
            </Box>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Categories */}
      <Box>
        <Title order={3} mb="md">
          <Group gap="xs">
            <IconBooks size={20} />
            Categories
          </Group>
        </Title>
        <Group gap="sm" wrap="wrap">
          {topCategories.map(([cat, count]) => (
            <Anchor
              key={cat}
              component={Link}
              to={`/concepts?category=${encodeURIComponent(cat)}`}
              underline="never"
            >
              <Badge size="lg" variant="light" color="violet" style={{ cursor: 'pointer' }}>
                {cat} ({count})
              </Badge>
            </Anchor>
          ))}
        </Group>
      </Box>

      {/* Tag Cloud */}
      <Box>
        <Title order={3} mb="md">
          <Group gap="xs">
            <IconTag size={20} />
            Popular Tags
          </Group>
        </Title>
        <Group gap={6} wrap="wrap">
          {topTags.map(([tag, count]) => (
            <Anchor
              key={tag}
              component={Link}
              to={`/concepts?tag=${encodeURIComponent(tag)}`}
              underline="never"
            >
              <Badge
                size="sm"
                variant="outline"
                color="gray"
                style={{ cursor: 'pointer' }}
              >
                {tag} ({count})
              </Badge>
            </Anchor>
          ))}
        </Group>
      </Box>

      {/* Recent Concepts */}
      <Box>
        <Group justify="space-between" mb="md">
          <Title order={3}>
            <Group gap="xs">
              <IconSparkles size={20} />
              Recently Added
            </Group>
          </Title>
          <Anchor component={Link} to="/concepts" size="sm">
            View all →
          </Anchor>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {recentConcepts.map((c) => c && <ConceptCard key={c.slug} concept={c} />)}
        </SimpleGrid>
      </Box>
    </Stack>
  );
}
