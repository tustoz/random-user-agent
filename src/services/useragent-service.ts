import Settings from '../settings/settings'
import {UseragentGenerator} from '../useragent/generator'
import Useragent from '../useragent/useragent'

export default class UseragentService {
  private readonly settings: Settings
  private readonly useragent: Useragent
  private readonly generator: UseragentGenerator

  constructor(settings: Settings, useragent: Useragent, generator: UseragentGenerator) {
    this.settings = settings
    this.useragent = useragent
    this.generator = generator
  }

  // Renew the useragent (generate a new and set them into the settings)
  renew(): {
    source: 'custom_agents_list' | 'generator'
    previous: string | undefined
    new: string
  } {
    const previous = this.useragent.get().useragent

    if (this.settings.get().customUseragent.enabled) {
      const list: string[] = this.settings.get().customUseragent.list

      if (list.length > 0) {
        const random: string = list[Math.floor(Math.random() * list.length)]

        if (random.trim().length > 0) {
          this.useragent.update({useragent: random})

          return {
            source: 'custom_agents_list',
            previous: previous,
            new: random,
          }
        }
      }
    }

    const generated = this.generator.generate(this.settings.get().generator.types)

    this.useragent.update({useragent: generated})

    return {
      source: 'generator',
      previous: previous,
      new: generated,
    }
  }
}