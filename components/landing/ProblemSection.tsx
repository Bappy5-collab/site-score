'use client';

import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BugReportIcon from '@mui/icons-material/BugReport';

const problems = [
  {
    icon: AssessmentIcon,
    title: 'Data overload, no direction',
    description: 'Traditional SEO tools dump reports and metrics. You’re left guessing what to fix first.',
  },
  {
    icon: TimelineIcon,
    title: 'Manual tracking and guesswork',
    description: 'Spreadsheets and one-off audits don’t show trends or prioritize next steps.',
  },
  {
    icon: PsychologyIcon,
    title: 'Insights that don’t turn into action',
    description: 'Recommendations sit in PDFs. Nothing turns into tasks or a clear growth plan.',
  },
  {
    icon: BugReportIcon,
    title: 'Reactive, not proactive',
    description: 'You find out about drops and issues too late. No automation or real-time alerts.',
  },
];

export default function ProblemSection() {
  return (
    <Box id="problems" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="The Problem"
          title="Sound familiar?"
          subtitle="Most SEO and performance tools stop at data. We turn it into a growth system."
        />

        <Grid container spacing={3}>
          {problems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Card
                    component={motion.div}
                    whileHover={{ y: -6 }}
                    sx={{
                      height: '100%',
                      background: 'var(--overlay-03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      '&:hover': { borderColor: 'rgba(239, 68, 68, 0.25)', boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)' },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '10px',
                          background: 'rgba(239, 68, 68, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Icon sx={{ fontSize: 26, color: '#F87171' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
