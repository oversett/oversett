import { Command } from 'commander'

const program = new Command()

program.name('translate').description('CLI for translating docs')

program.parse()