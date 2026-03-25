import { AppShell as MantineAppShell, Group, Title, Text, Anchor, Badge, Container } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { IconBook, IconHome } from '@tabler/icons-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <MantineAppShell
      header={{ height: 64 }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Anchor component={Link} to="/" c="white" underline="never">
              <Group gap="xs">
                <IconBook size={24} />
                <Title order={3} c="white">
                  Astra
                </Title>
                <Badge size="sm" variant="light" color="gray">
                  Knowledge Base
                </Badge>
              </Group>
            </Anchor>

            <Group gap="md">
              <Anchor
                component={Link}
                to="/"
                c="gray"
                underline="never"
                fw={location.pathname === '/' ? 700 : 400}
              >
                <Group gap={4}>
                  <IconHome size={16} />
                  <Text size="sm">Home</Text>
                </Group>
              </Anchor>
              <Anchor
                component={Link}
                to="/concepts"
                c="gray"
                underline="never"
                fw={location.pathname === '/concepts' ? 700 : 400}
              >
                <Group gap={4}>
                  <IconBook size={16} />
                  <Text size="sm">Concepts</Text>
                </Group>
              </Anchor>
            </Group>
          </Group>
        </Container>
      </MantineAppShell.Header>

      <MantineAppShell.Main>
        <Container size="lg">
          {children}
        </Container>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
