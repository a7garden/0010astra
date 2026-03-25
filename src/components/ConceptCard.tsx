import { Card, Text, Badge, Group, Anchor, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconCalendar, IconTag } from '@tabler/icons-react';
import type { Concept } from '../types';

const confidenceColors: Record<string, string> = {
  high: 'green',
  medium: 'yellow',
  low: 'red',
};

interface ConceptCardProps {
  concept: Concept;
}

export default function ConceptCard({ concept }: ConceptCardProps) {
  const preview = concept.body
    .replace(/^#+\s+.*/gm, '')
    .replace(/[\[\]#*>]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 150);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      to={`/concepts/${concept.slug}`}
      style={{ textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.15s ease' }}
      className="concept-card"
    >
      <Group justify="space-between" mb="xs">
        <Text fw={700} size="lg" lineClamp={1}>
          {concept.title}
        </Text>
        <Badge
          size="sm"
          color={confidenceColors[concept.confidence] || 'gray'}
          variant="light"
        >
          {concept.confidence}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {preview}
      </Text>

      <Group justify="space-between">
        <Group gap={4}>
          <IconCalendar size={14} style={{ opacity: 0.5 }} />
          <Text size="xs" c="dimmed">{concept.created}</Text>
        </Group>
        <Badge size="sm" variant="outline" color="violet">
          {concept.category}
        </Badge>
      </Group>

      {concept.tags.length > 0 && (
        <Group gap={4} mt="xs" wrap="wrap">
          <IconTag size={12} style={{ opacity: 0.5 }} />
          {concept.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} size="xs" variant="dot" color="gray">
              {tag}
            </Badge>
          ))}
          {concept.tags.length > 3 && (
            <Text size="xs" c="dimmed">+{concept.tags.length - 3}</Text>
          )}
        </Group>
      )}
    </Card>
  );
}
