import { useParams, Link } from 'react-router-dom';
import {
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Card,
  Box,
  Anchor,
  Breadcrumbs,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCalendar,
  IconTag,
  IconLink,
  IconBook,
  IconExternalLink,
} from '@tabler/icons-react';
import { getBySlug, concepts, meta } from '../data';
import MarkdownRenderer from '../components/MarkdownRenderer';

const confidenceColors: Record<string, string> = {
  high: 'green',
  medium: 'yellow',
  low: 'red',
};

export default function ConceptDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const concept = slug ? getBySlug(slug) : undefined;

  if (!concept) {
    return (
      <Box ta="center" py="xl">
        <Title order={2}>Concept Not Found</Title>
        <Text c="dimmed" mt="sm">
          The concept &quot;{slug}&quot; does not exist in the knowledge base.
        </Text>
        <Anchor component={Link} to="/concepts" mt="md">
          ← Back to Concepts
        </Anchor>
      </Box>
    );
  }

  const backlinkConcepts = concept.backlinks
    .map((s) => getBySlug(s))
    .filter(Boolean);

  const relatedConcepts = concept.related
    .map((r) => getBySlug(r))
    .filter(Boolean);

  return (
    <Stack gap="lg" py="md">
      {/* Breadcrumbs */}
      <Breadcrumbs>
        <Anchor component={Link} to="/" size="sm" c="dimmed">
          Home
        </Anchor>
        <Anchor component={Link} to="/concepts" size="sm" c="dimmed">
          Concepts
        </Anchor>
        <Text size="sm" c="dimmed">{concept.title}</Text>
      </Breadcrumbs>

      {/* Header */}
      <Paper p="xl" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={1}>{concept.title}</Title>
          <Badge
            size="lg"
            color={confidenceColors[concept.confidence] || 'gray'}
            variant="light"
          >
            {concept.confidence}
          </Badge>
        </Group>

        {/* Aliases */}
        {concept.aliases.length > 0 && (
          <Group gap="xs" mb="md">
            {concept.aliases.map((alias) => (
              <Badge key={alias} variant="dot" color="gray" size="sm">
                {alias}
              </Badge>
            ))}
          </Group>
        )}

        {/* Metadata */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Group gap="xs">
              <IconBook size={14} style={{ opacity: 0.6 }} />
              <Text size="sm" c="dimmed">Category:</Text>
              <Anchor
                component={Link}
                to={`/concepts?category=${encodeURIComponent(concept.category)}`}
                size="sm"
              >
                <Badge variant="light" color="gray">{concept.category}</Badge>
              </Anchor>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Group gap="xs">
              <IconCalendar size={14} style={{ opacity: 0.6 }} />
              <Text size="sm" c="dimmed">Created:</Text>
              <Text size="sm">{concept.created}</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Group gap="xs">
              <IconExternalLink size={14} style={{ opacity: 0.6 }} />
              <Text size="sm" c="dimmed">Source:</Text>
              <Text size="sm">{concept.source}</Text>
            </Group>
          </Grid.Col>
        </Grid>

        {/* Tags */}
        {concept.tags.length > 0 && (
          <Group gap="xs" mt="md" wrap="wrap">
            <IconTag size={14} style={{ opacity: 0.6 }} />
            {concept.tags.map((tag) => (
              <Anchor
                key={tag}
                component={Link}
                to={`/concepts?tag=${encodeURIComponent(tag)}`}
              >
                <Badge size="sm" variant="outline" color="gray">
                  {tag}
                </Badge>
              </Anchor>
            ))}
          </Group>
        )}
      </Paper>

      {/* Body */}
      <Paper p="xl" radius="md" withBorder>
        <Box
          style={{
            lineHeight: 1.8,
            fontSize: '0.95rem',
          }}
          className="concept-body"
        >
          <MarkdownRenderer content={concept.body} />
        </Box>
      </Paper>

      {/* Related Concepts */}
      {relatedConcepts.length > 0 && (
        <Box>
          <Title order={3} mb="md">
            <Group gap="xs">
              <IconLink size={18} />
              Related Concepts
            </Group>
          </Title>
          <Group gap="sm" wrap="wrap">
            {relatedConcepts.map((c) => c && (
              <Anchor
                key={c.slug}
                component={Link}
                to={`/concepts/${c.slug}`}
                underline="never"
              >
                <Badge size="lg" variant="light" color="gray">
                  {c.title}
                </Badge>
              </Anchor>
            ))}
          </Group>
        </Box>
      )}

      {/* Backlinks */}
      {backlinkConcepts.length > 0 && (
        <Box>
          <Title order={3} mb="md">
            <Group gap="xs">
              <IconArrowLeft size={18} />
              Backlinks
            </Group>
          </Title>
          <Text size="sm" c="dimmed" mb="sm">
            These concepts link to this one:
          </Text>
          <Group gap="sm" wrap="wrap">
            {backlinkConcepts.map((c) => c && (
              <Anchor
                key={c.slug}
                component={Link}
                to={`/concepts/${c.slug}`}
                underline="never"
              >
                <Badge size="lg" variant="outline" color="blue">
                  {c.title}
                </Badge>
              </Anchor>
            ))}
          </Group>
        </Box>
      )}

      {/* Navigation */}
      <Divider />
      <Anchor component={Link} to="/concepts">
        <Group gap="xs">
          <IconArrowLeft size={16} />
          <Text size="sm">Back to all concepts</Text>
        </Group>
      </Anchor>
    </Stack>
  );
}
